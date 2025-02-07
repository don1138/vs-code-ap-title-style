// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Change selected text to Title Case, then make prepositions Lower Case
function applyAPTitleStyle(text) {
  const words = text.split(/\b/); // Split the text into words using word boundaries

  let isPreviousWhitespace = true; // To detect whitespace characters like spaces and line breaks

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // Check if the current word is a whitespace character
    if (/\s/.test(word)) {
      isPreviousWhitespace = true;
      continue; // Skip whitespace characters
    }

    // Capitalize the first letter of each word
    if (isPreviousWhitespace) {
      word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      word = word.toLowerCase();
    }

    // Fix common prepositions
    const prepositions = ["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to"];

    if (prepositions.includes(word.toLowerCase())) {
      word = word.toLowerCase();
    }

    words[i] = word;
    isPreviousWhitespace = false;
  }

  return words.join('');
}

function activate(context) {
  console.log("Extension activated");

  let disposable = vscode.commands.registerCommand('extension.applyAPTitleStyle', () => {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const selections = editor.selections;

      // Apply the transformation to each selection
      editor.edit((editBuilder) => {
        selections.forEach((selection) => {
          const text = document.getText(selection);
          const modifiedText = applyAPTitleStyle(text);
          editBuilder.replace(selection, modifiedText);
        });
      });
    }
  });

  context.subscriptions.push(disposable);
}

module.exports = {
  activate
};