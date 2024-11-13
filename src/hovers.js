
module.exports =  createHoverProvider = async (context) => {
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