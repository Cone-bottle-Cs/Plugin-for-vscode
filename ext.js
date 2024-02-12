const vscode = require('vscode');

let activeEditor = vscode.window.activeTextEditor;

function activate(context) {
    console.log('Congratulations, your extension "vsc-plugin-demo" is now active!');

    // 注册命令
    let disposable = vscode.commands.registerCommand('extension.showHighlighterWidget', function() {
        // 创建一个输入框悬浮窗口
        const panel = vscode.window.createWebviewPanel(
            'highlighterWidget',
            'Highlighter Widget',
            vscode.ViewColumn.Active, {
                // 允许悬浮窗口使用 JavaScript
                enableScripts: true
            }
        );

        // 设置悬浮窗口中的 HTML 内容
        panel.webview.html = getHTMLContent(panel);

        // 监听悬浮窗口中的消息
        panel.webview.onDidReceiveMessage(message => {
            if (message.command === 'highlightStrings') {
                const { stringA, stringB } = message;
                highlightStrings(stringA, stringB);
            }
        });
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {}

function getHTMLContent(panel) {
    // 返回包含输入框和按钮的 HTML 字符串
    return `
        <html>
        <body>
            <h2>Highlighter Widget</h2>
            <div>
                <label for="stringA">Enter String A:</label>
                <input type="text" id="stringA">
            </div>
            <div>
                <label for="stringB">Enter String B:</label>
                <input type="text" id="stringB">
            </div>
            <button id="highlightButton">Highlight Strings</button>

            <script>
                const vscode = acquireVsCodeApi();

                document.getElementById('highlightButton').addEventListener('click', () => {
                    const stringA = document.getElementById('stringA').value;
                    const stringB = document.getElementById('stringB').value;

                    // 向插件发送消息
                    vscode.postMessage({
                        command: 'highlightStrings',
                        stringA: stringA,
                        stringB: stringB
                    });
                });
            </script>
        </body>
        </html>
    `;
}

function highlightStrings(stringA, stringB) {
    // 实现高亮字符串的逻辑
    console.log(`Highlighting String A: ${stringA}`);
    console.log(`Highlighting String B: ${stringB}`);

    const editor = activeEditor;
    if (editor) {
        const document = editor.document;
        const text = document.getText();
        const rangesA = findStringRanges(text, stringA);
        const rangesB = findStringRanges(text, stringB);

        const decorationTypeA = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'yellow'
        });
        const decorationTypeB = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'blue'
        });

        console.log(`editor: ${editor}`);
        editor.setDecorations(decorationTypeA, rangesA);
        editor.setDecorations(decorationTypeB, rangesB);
    } else {
        vscode.window.showErrorMessage('No active editor found.');
    }
}

function findStringRanges(text, searchString) {
    const ranges = [];
    const regex = new RegExp(searchString, 'g');
    const document = activeEditor.document;
    let match;
    while (match = regex.exec(text)) {
        let startPos = document.positionAt(match.index);
        let endPos = document.positionAt(match.index + match[0].length);
        let range = new vscode.Range(startPos, endPos);
        ranges.push(range);
    }
    return ranges;
}

module.exports = {
    activate,
    deactivate
};