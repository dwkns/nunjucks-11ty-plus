const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { createContext } = require("@dprint/formatter");
const typescriptPlugin = require("@dprint/typescript");
const jsonPlugin = require("@dprint/json");
const markdownPlugin = require("@dprint/markdown");
const { formatContentAsync, formatStyleBlocksAsync } = require('./formatter');
const prettier = require('prettier');

const outputChannel = vscode.window.createOutputChannel('Nunjucks 11ty Plus');
let dprintContext = null;

// Initialize dprint formatter context
async function initializeDprintContext() {
  if (dprintContext) return dprintContext;
  
  try {
    const context = createContext({ indentWidth: 2 });
    
    // Add available plugins
    context.addPlugin(fs.readFileSync(typescriptPlugin.getPath()), {});
    context.addPlugin(fs.readFileSync(jsonPlugin.getPath()), {});
    context.addPlugin(fs.readFileSync(markdownPlugin.getPath()), {});
    
    // Add markup plugin for HTML/Nunjucks/Vue/Svelte etc.
    // Load directly from node_modules since dprint-plugin-markup is just a WASM container
    const markupPluginPath = path.join(__dirname, '..', 'node_modules', 'dprint-plugin-markup', 'plugin.wasm');
    if (fs.existsSync(markupPluginPath)) {
      context.addPlugin(fs.readFileSync(markupPluginPath), {});
      appendLog('Markup plugin loaded', 'debug');
    } else {
      appendLog('Markup plugin not found at ' + markupPluginPath, 'warn');
    }
    
    dprintContext = context;
    appendLog('Dprint context initialized', 'success');
    return context;
  } catch (err) {
    appendLog('Failed to initialize dprint: ' + (err && err.message), 'error');
    throw err;
  }
}

function appendLog(message, level = 'info') {
  try {
    const timestamp = new Date().toISOString();
    let prefix = '';

    switch (level) {
      case 'error':
        prefix = '[ERROR]';
        break;
      case 'warn':
        prefix = '[WARN]';
        break;
      case 'success':
        prefix = '[✓]';
        break;
      case 'debug':
        prefix = '[DEBUG]';
        break;
      case 'info':
      default:
        prefix = '[INFO]';
        break;
    }

    const logEntry = `${timestamp} ${prefix} ${message}`;
    outputChannel.appendLine(logEntry);
  } catch (e) {
    // ignore logging errors
  }
}


const formatterErrorCollection = vscode.languages.createDiagnosticCollection('formatterErrorCollection');

function updateDiagnostics(document, formatterErrorCollection, usefulError) {
  if (document) {
    const errorRange = new vscode.Range(
      new vscode.Position(usefulError.startLine, usefulError.startColumn),
      new vscode.Position(usefulError.endLine, usefulError.endColumn),
    );
    formatterErrorCollection.set(document.uri, [
      {
        code: "",
        message: usefulError.msg,
        range: errorRange,
        severity: vscode.DiagnosticSeverity.Error,
        source: "Nunjucks 11ty Plus",
      },
    ]);
  } else {
    formatterErrorCollection.clear();
  }
} 

async function formatWithDprint(content, filePath) {
  try {
    const context = await initializeDprintContext();
    const formatted = context.formatText({
      filePath: filePath,
      fileText: content,
    });
    appendLog('Format succeeded (' + (formatted && formatted.length) + ' bytes)', 'debug');
    return formatted;
  } catch (err) {
    appendLog('Format error: ' + (err && (err.message || String(err))), 'error');
    throw err;
  }
}


async function format(document, range, options) {
  const result = [];
  const content = document.getText(range);

  try {
    const runFn = async (content, stdinPath) => {
      if (stdinPath.endsWith('.yaml') || stdinPath.endsWith('.yml')) {
        try {
          return await prettier.format(content, { parser: 'yaml', printWidth: 100 });
        } catch {
          return content;
        }
      }
      return formatWithDprint(content, stdinPath);
    };
    const formatted = await formatContentAsync(content, document.fileName || 'file.njk', runFn);
    const withCss = await formatStyleBlocksAsync(formatted, (css) =>
      prettier.format(css, { parser: 'css', printWidth: 100 })
    );
    formatterErrorCollection.delete(document.uri);
    result.push(vscode.TextEdit.replace(range, withCss));
  } catch (error) {
    const message = (error && (error.message || String(error))) || 'Unknown formatting error';
    const usefulError = {
      startLine: 0,
      startColumn: 0,
      endLine: Math.max(0, document.lineCount - 1),
      endColumn: document.lineAt(document.lineCount - 1).text.length,
      msg: message,
    };
    updateDiagnostics(document, formatterErrorCollection, usefulError);
    vscode.window.showErrorMessage('Formatting failed: ' + message);
  }

  return result;
} 

function activate(context) {
  context.subscriptions.push(formatterErrorCollection);
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document) {
        formatterErrorCollection.delete(event.document.uri);
      }
    }),
  );

  const formatter = {
    provideDocumentFormattingEdits(document, options) {
      const start = new vscode.Position(0, 0);
      const end = new vscode.Position(
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length,
      );
      const range = new vscode.Range(start, end);
      return format(document, range, options);
    },
    provideDocumentRangeFormattingEdits(document, range, options) {
      return format(document, range, options);
    },
  };

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("nunjucks", formatter),
    vscode.languages.registerDocumentRangeFormattingEditProvider("nunjucks", formatter),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('nunjucks.showFormatterInfo', async () => {
      outputChannel.show(true);
      appendLog('--- Formatter Info ---');
      appendLog('Using @dprint/formatter WASM API (no CLI binary needed)');
      appendLog('Available formatters: HTML/Nunjucks (markup_fmt), TypeScript, JavaScript, JSON, Markdown');
      
      try {
        const context = await initializeDprintContext();
        appendLog('Dprint context initialized successfully with all plugins');
      } catch (err) {
        appendLog('Error initializing dprint context: ' + (err && err.message));
      }

      appendLog('Tip: Markup formatting supports HTML, Vue, Svelte, Astro, Angular, Jinja, Twig, Nunjucks, Vento, Mustache, and XML files.');
    }),
  );

  // Associate .html files with Nunjucks if the user opted in
  applyHtmlAssociation();
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('nunjucks.associateHtml')) {
        applyHtmlAssociation();
      }
    }),
  );

  appendLog('Nunjucks 11ty Plus activated', 'info');
  initializeDprintContext().catch((err) => {
    appendLog('Error initializing dprint context at activation: ' + (err && err.message), 'error');
  });
}

function applyHtmlAssociation() {
  const config = vscode.workspace.getConfiguration('nunjucks');
  const associate = config.get('associateHtml', false);
  const filesConfig = vscode.workspace.getConfiguration('files');
  const associations = filesConfig.get('associations', {});

  if (associate) {
    if (associations['*.html'] !== 'nunjucks') {
      associations['*.html'] = 'nunjucks';
      filesConfig.update('associations', associations, vscode.ConfigurationTarget.Workspace);
      appendLog('Associated .html files with Nunjucks', 'info');
    }
  } else {
    if (associations['*.html'] === 'nunjucks') {
      delete associations['*.html'];
      filesConfig.update('associations', associations, vscode.ConfigurationTarget.Workspace);
      appendLog('Removed .html → Nunjucks association', 'info');
    }
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
