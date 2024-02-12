const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "vsc-plugin-demo" is now active!');

    let disposable = vscode.commands.registerCommand('extension.showHighlighterWidget', function() {
        // 显示悬浮窗口
        vscode.window.showInputBox({ prompt: 'Enter String A' }).then(stringA => {
            vscode.window.showInputBox({ prompt: 'Enter String B' }).then(stringB => {
                // 在这里你可以处理用户输入的字符串
                highlightStrings(stringA, stringB);
            });
        });
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {}

function highlightStrings(stringA, stringB) {
    // 实现高亮字符串的逻辑
    console.log(`Highlighting String A: ${stringA}`);
    console.log(`Highlighting String B: ${stringB}`);
}

module.exports = {
    activate,
    deactivate
};