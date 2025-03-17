// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Change selected text to Title Case, then make prepositions Lower Case
function applyAPTitleStyle(text) {
  // Split text by word boundaries while preserving punctuation and whitespace.
  const words = text.split(/\b/);
  let isPreviousWhitespace = true; // Flag for start of a word.
  let isFirstWord = true;          // Flag for the first non-whitespace token.
  
  // Define prepositions to lowercase in non-initial positions.
  const prepositions = ["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to"];

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // If the token is whitespace, update the flag and continue.
    if (/\s/.test(word)) {
      isPreviousWhitespace = true;
      continue;
    }
    
    if (isPreviousWhitespace) {
      // Always capitalize the first word regardless of its content.
      if (isFirstWord) {
        word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        isFirstWord = false;  // First word has been processed.
      } else {
        // For subsequent words that start after whitespace,
        // apply normal Title Case transformation.
        word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        // If the word is a preposition, convert it to lower case.
        if (prepositions.includes(word.toLowerCase())) {
          word = word.toLowerCase();
        }
      }
    } else {
      // For non-initial parts of a word, simply lowercase.
      word = word.toLowerCase();
      // Even here, ensure prepositions remain in lower-case.
      if (prepositions.includes(word)) {
        word = word.toLowerCase();
      }
    }
    
    words[i] = word;
    isPreviousWhitespace = false; // Mark that we're now in the middle of a word.
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