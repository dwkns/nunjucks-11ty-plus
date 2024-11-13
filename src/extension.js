const vscode = require("vscode");
const prettier = require("prettier");
const util = require("node:util");
const path = require("path");

const prettierErrorCollection = vscode.languages.createDiagnosticCollection("prettierErrorCollection");

function updateDiagnostics(document, prettierErrorCollection, usefulError) {
 
  if (document) {

    const errorRange =  new vscode.Range(
      new vscode.Position(usefulError.startLine, usefulError.startColumn),
      new vscode.Position(usefulError.endLine, usefulError.endColumn),
    )


    console.log("writing diagnostics: ",errorRange)
    prettierErrorCollection.set(document.uri, [
      {
        code: "",
        message: usefulError.msg,
        range: errorRange,
        severity: vscode.DiagnosticSeverity.Error,
        source: "",
        // relatedInformation: [
        //   new vscode.DiagnosticRelatedInformation(
        //     new vscode.Location(
        //       document.uri,
        //       errorRange
        //     ),
        //     "first assignment to `x`",
        //   ),
        // ],
      },
    ]);
  } else {
    console.log("clearing diagnostics in updateDiagnostics ")
    prettierErrorCollection.clear();
  }


}

const createHoverProvider = async (context) => {
  return vscode.languages.registerHoverProvider("nunjucks", {
    provideHover(document, position, token) {
      let formattedDocument = JSON.stringify(document, undefined, 2);
      let formattedPosition = JSON.stringify(position, undefined, 2);
      let formattedToken = JSON.stringify(token, undefined, 2);
      return {
        contents: [
          `Hover at position ${formattedPosition} with token:  ${formattedToken}  `,
        ],
      };
    },
  });
};

async function format(document, range, options) {
  const result = [];
  const content = document.getText(range);
  const editor = vscode.window.activeTextEditor.options;
  const workspace = vscode.workspace.getConfiguration("editor");
  const indentsize = editor.tabSize || workspace.tabSize;

  try {
    const fmtopts = { semi: false, parser: "html" };
    const newText = await prettier.format(content, fmtopts);
    result.push(vscode.TextEdit.replace(range, newText));
  } catch (error) {
    const usefulError = {
      startLine: error.loc.start.line,
      startColumn: error.loc.start.column,
      endLine: error.loc.end.line,
      endColumn: error.loc.end.column,
      msg: error.cause.msg,
    };

    console.log(
      "usefulError: ",
      util.inspect(usefulError, {
        showHidden: false,
        depth: 0,
        colorize: true,
      }),
    );

    updateDiagnostics(document, prettierErrorCollection,usefulError );

    vscode.window.showInformationMessage(error.message);
  }

  return result;
}

function activate(context) {
  // boilerplate to register the extension.

  console.log("activating with context: ", context);

  // context.subscriptions.push(
  //   vscode.window.onDidChange(function (event) {
  //     console.log("Event happened: " + event);
  //   }),
  // );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(
      (event) => {
        // clears the 
        prettierErrorCollection.clear();
      },
      null,
      context.subscriptions,
    ),
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("nunjucks", {
      provideDocumentFormattingEdits(document, options) {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length,
        );
        const range = new vscode.Range(start, end);
        console.log("about to run format(): ");
        return format(document, range, options);
      },
    }),
  );

  // context.subscriptions.push(createHoverProvider(context));
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
