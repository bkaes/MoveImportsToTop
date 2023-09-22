"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    // Registering the command
    let disposable = vscode.commands.registerCommand('extension.moveImportsToTop', moveImportsToTop);
    context.subscriptions.push(disposable);
    // Registering the code action provider for 'javascript' (you can add more languages as needed)
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider({ language: 'javascript', scheme: 'file' }, new MoveImportsToTopActionProvider(), { providedCodeActionKinds: MoveImportsToTopActionProvider.providedCodeActionKinds }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function moveImportsToTop() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const text = document.getText();
        // Regex to match import statements
        const importRegex = /^(import .*)$/gm;
        const imports = [...text.matchAll(importRegex)].map(match => match[0]);
        if (imports.length) {
            // Construct a version of the text without the import statements
            let textWithoutImports = text;
            imports.forEach(imp => {
                textWithoutImports = textWithoutImports.replace(imp, '').trim();
            });
            // Remove consecutive blank lines with a regex
            textWithoutImports = textWithoutImports.replace(/^\s*\n/gm, '');
            // Combine the imports with the rest of the code
            const newText = `${imports.join('\n')}\n\n${textWithoutImports}`;
            editor.edit(editBuilder => {
                const entireRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
                editBuilder.replace(entireRange, newText);
            });
        }
    }
}
class MoveImportsToTopActionProvider {
    provideCodeActions(document, range, context, token) {
        const action = new vscode.CodeAction('Move Imports to Top', MoveImportsToTopActionProvider.providedCodeActionKinds[0]);
        action.command = { title: 'Move Imports to Top', command: 'extension.moveImportsToTop' };
        return [action];
    }
}
MoveImportsToTopActionProvider.providedCodeActionKinds = [vscode.CodeActionKind.Source.append('moveImportsToTop')];
//# sourceMappingURL=extension.js.map