const vscode = require("vscode");
const prettier = require("prettier");


// Configure a collection to hold Prettier Error feedback.
// Collections are used to feed information back to the VSCode UI
const prettierErrorCollection = vscode.languages.createDiagnosticCollection(
  "prettierErrorCollection",
);

function updateDiagnostics(document, prettierErrorCollection, usefulError) {
  if (document) {
    const errorRange = new vscode.Range(
      new vscode.Position(usefulError.startLine, usefulError.startColumn),
      new vscode.Position(usefulError.endLine, usefulError.endColumn),
    );
    prettierErrorCollection.set(document.uri, [
      {
        code: "",
        message: usefulError.msg,
        range: errorRange,
        severity: vscode.DiagnosticSeverity.Error,
        source: "",
        // relatedInformation: [  // Can provide addtional feedback if required.
        //   new vscode.DiagnosticRelatedInformation(
        //     new vscode.Location(
        //       document.uri,
        //       errorRange
        //     ),
        //     "Related information Error Message",
        //   ),
        // ],
      },
    ]);
  } else {
    prettierErrorCollection.clear(); // clears the error messages.
  }
}

// Example Hover Provider for later use
const registerHoverProvider = async (context) => {
  return vscode.languages.registerHoverProvider("nunjucks", {
    provideHover(document, position, token) {
      let formattedDocument = JSON.stringify(document, undefined, 2);
      let formattedPosition = JSON.stringify(position, undefined, 2);
      let formattedToken = JSON.stringify(token, undefined, 2);
      return hover(formattedPosition, formattedToken);
    },
  });
};

const hover = async (formattedPosition, formattedToken) => {
  return {
    contents: [
      `Hover at position ${formattedPosition} with token:  ${formattedToken}  `,
    ],
  };
};

// Do the formatting
async function format(document, range, options) {
  const result = [];
  const content = document.getText(range);
  const editor = vscode.window.activeTextEditor.options;
  const workspace = vscode.workspace.getConfiguration("editor");
  const indentsize = editor.tabSize || workspace.tabSize;

  try {
    // pass off the document to the prettier HTML parser
    // We should probably use the njinja one instead (with some modifications)
    const fmtopts = { semi: false, parser: "html" };
    const newText = await prettier.format(content, fmtopts);
    result.push(vscode.TextEdit.replace(range, newText));
  } catch (error) {
    // If prettier fails for some reason, deconstcut the error
    const usefulError = {
      startLine: error.loc.start.line,
      startColumn: error.loc.start.column,
      endLine: error.loc.end.line,
      endColumn: error.loc.end.column,
      msg: error.cause.msg,
    };

    // Call for an update to the inline diagnostics with our error.
    updateDiagnostics(document, prettierErrorCollection, usefulError);

    // Use a standard VSCode info message too.
    vscode.window.showInformationMessage(error.message);
  }

  return result;
}

function activate(context) {
  // called when the extension  activates.

  // watch for editing changes & clear the formatter error messages when we detect one.
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(
      (event) => {
        // do we need more checking the type of event?
        prettierErrorCollection.clear(); // actually do the clear
      },
      null,
      context.subscriptions,
    ),
  );

  const registerFormatter = (context) => {
    vscode.languages.registerDocumentFormattingEditProvider("nunjucks", {
      provideDocumentFormattingEdits(document, options) {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length,
        );
        const range = new vscode.Range(start, end);
        return format(document, range, options);
      },
    });
  };

  // register our formatter
  context.subscriptions.push(registerFormatter(context));

  // register our hover provider
  context.subscriptions.push(registerHoverProvider(context));
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
