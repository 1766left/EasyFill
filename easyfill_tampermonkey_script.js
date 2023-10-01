// ==UserScript==
// @name         EasyFill
// @namespace    http://easyfill.tool.elfe/
// @version      0.2
// @description  Add a menu for easy filling in OpenAI chat window
// @author       Elfe & ttmouse & GPT
// @match        https://chat.openai.com/*
// @icon         
// @grant        none
// ==/UserScript==

const setting_usage_text = `使用说明
🪄🪄🪄🪄🪄🪄🪄🪄
填充
每个按钮对应一个预设好的 prompt  ，{__PLACE_HOLDER__} 里的内容会被你鼠标选中的文字替代掉。
如果没有选中，且不是直接发送的按钮，你的光标会停留在 __PLACE_HOLDER__ 处让你补充。
🪄🪄🪄🪄🪄🪄🪄🪄
🚀 直接发送
带有🚀符号的按钮，点击后会替换 {__PLACE_HOLDER__} 内容并直接发送。`;

const setting_new_setting_text = `新功能组名称
下面的 🪄 用于区分功能按钮
🪄🪄🪄🪄🪄🪄🪄🪄
第一行是按钮名称
第二行开始是prompt。{__PLACE_HOLDER__} 里的内容会被你鼠标选中的文字替代掉。
🪄🪄🪄🪄🪄🪄🪄🪄
🚀 直接发送的按钮
带有🚀符号的按钮，点击后会替换 {__PLACE_HOLDER__} 内容并直接发送。`;


const default_setting_texts = [
    `英语练习
先点启动，再贴大段文章，然后需要干啥就选中了文字点啥功能
🪄🪄🪄🪄🪄🪄🪄🪄
🚀启动
你是我的英语老师，我需要你陪我练习英语，准备托福考试。
请**用英语和我对话**，涉及英语例句、题目和话题探讨时请用托福水平的书面英语，但在我明确提出需要时切换到中文。
为了让我的学习更愉悦，请用轻松的语气，并添加一些 emoji。
接下来我会给你一篇英文文章，请记住文章，然后我会向你请求帮助。
如果你理解了，请说 Let's begin！
🪄🪄🪄🪄🪄🪄🪄🪄
🚀英译中
请帮我把下面这段话翻译直译成中文，不要遗漏任何信息。
然后请判断文字是否符合中文表达习惯，如果不太符合，请重新意译，在遵循愿意的前提下让内容更通俗易懂。
输出格式应该是

直译：直译的内容
---
（如果有必要的话）意译：意译的内容


待翻译的内容：
'''
{__PLACE_HOLDER__} 
'''
🪄🪄🪄🪄🪄🪄🪄🪄
中译英
请帮我用最地道的方式帮我把下面这段话翻译成英文。

待翻译的内容：
'''
{__PLACE_HOLDER__}
'''
🪄🪄🪄🪄🪄🪄🪄🪄
🚀学单词
'''
{__PLACE_HOLDER__}
'''

请帮我学习这个单词
1. 请给出单词的音标、词性、中文意思、英文意思
2. 如果我们前面的讨论中出现过这个单词，请结合它的上下文，重点讲解在上下文中单词的意思和用法
3. 请给出更多例句
4. 如果有容易混淆的单词，请给出对比
🪄🪄🪄🪄🪄🪄🪄🪄
🚀深入解释
我不太理解这段文字的具体含义，能否结合上下文，给我一个更深入的中文解释？
解释时请着重讲解其中有难度的字词句。
如果有可能，请为我提供背景知识以及你的观点。
'''
{__PLACE_HOLDER__}
'''
🪄🪄🪄🪄🪄🪄🪄🪄
🚀封闭题
请对下面这段文字，按照托福阅读理解的难度，用英文为我出三道有标准答案的问答题。
请等待我回答后，再告诉我标准答案，并加以解释。
'''
{__PLACE_HOLDER__}
'''
🪄🪄🪄🪄🪄🪄🪄🪄
🚀开放题
请对下面这段文字，按照托福口语和作文的难度，用英文为我出一道开放题，我们来进行探讨。
'''
{__PLACE_HOLDER__}
'''
    
`,
setting_usage_text
];






const LSID_SETTING_TEXTS = 'setting_texts_v0.4';
const LSID_SETTING_CURRENT_INDEX = 'setting_current_index_v0.4';

const style = `
    .settings-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .settings-content {
        background-color: #f0f1ee;
        color: #535e5e;
        padding: 20px;
        width: 50%;
        height: 80%;
        overflow-y: auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .settings-dropdown {
        outline: none;
        border: 0px;
    }

    .settings-textarea {
        width: 100%;
        height: calc(100% - 60px); 
        resize: vertical;
        background-color: #fff;
        color: #000;
        border-radius: 0.75em;
        border: 0px;
        padding: 18px 18px;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.024) 0px 0px 5px, rgba(0, 0, 0, 0.05) 0px 1px 2px;
    }

    .settings-submit {
        background-color: #469c7b;
        color: #fff;
        padding: 8px 18px;
        border: none;
        border-radius: 30px;
        cursor: pointer;    
    }

    .settings-submit:hover {
        background-color: #93B1A6;
    }

    .settings-submit:disabled {
        background-color: #B4B4B3;  /* 灰色背景 */
        color: #808080;            /* 深灰色文字 */
        cursor: not-allowed;       /* 禁用的光标样式 */
    }

    #menuContainer {
        width: auto;
        display: inline-block;
        background-color: #fff;
        color: #000;
        border-radius: 0.55em;
        border: 0px;
        padding: 5px;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.1) 0px 2px 5px, rgba(0, 0, 0, 0.05) 0px 3px 3px;
    }
    
    #menuContainer button:disabled {
        height: 1px;
        color: #c6c6c600;
        padding: 0px;
        border-bottom: 1px solid #dddddd8c;
    }
    
    #menuContainer button:disabled:hover {
        height: 1px;
        color: #c6c6c600;
        padding: 0px;
        border-bottom: 1px solid #dddddd8c;
    }
    
    
    #menuContainer button {
        margin-bottom: 1px;
    }
    
    #menuContainer button:hover {
     background-color: #f1f1f1;
     border-radius: 5px;
     padding: 5px 10px;
     width: 100%;
    }
    
    #menuContainer button {
     border-radius: 5px;
     padding: 5px 10px;
     width: 100%;
        text-align: left; 
    }
`;


const styleElement = document.createElement('style');
styleElement.innerHTML = style;
document.head.appendChild(styleElement);


let setting_texts = JSON.parse(localStorage.getItem(LSID_SETTING_TEXTS)) || default_setting_texts;
let setting_current_index = localStorage.getItem(LSID_SETTING_CURRENT_INDEX) || 0;
let current_setting_text = setting_texts[setting_current_index];

async function sendToGPT(template, selectedText, sendDirectly = false) {
    let placeholderPosition = template.indexOf('{__PLACE_HOLDER__}');
    let finalText = template.replace('{__PLACE_HOLDER__}', selectedText);
//    event.preventDefault();
    const inputElement = document.getElementById('prompt-textarea');
    inputElement.value = finalText;

    // 设置光标位置
    let cursorPosition;
    if (placeholderPosition !== -1) {
        // 将光标放在替换文本的结束位置
        if (selectedText) {
            cursorPosition = placeholderPosition + selectedText.length;
        } else {
            cursorPosition = placeholderPosition;
        }
    } else {
        cursorPosition = inputElement.value.length; // 光标放在文本末尾
    }

    if (sendDirectly && selectedText) {
        const inputEvent = new Event('input', { 'bubbles': true });
        inputElement.dispatchEvent(inputEvent);
        await new Promise(resolve => setTimeout(resolve, 50));
        const sendButton = document.querySelector('[data-testid="send-button"]');
        if (sendButton) {
            sendButton.click();
        }
    }

    inputElement.focus();
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
}

// 创建单个菜单项
function createMenuItem(label, action) {
  const menuItem = document.createElement('button');
  menuItem.style.display = 'block';
  menuItem.innerHTML = label;
  if (action == null) {
    menuItem.disabled = true;
  } else {
    menuItem.onclick = () => {
        action();
        contextMenu.style.display = 'none';
    };
  }
  
  return menuItem;
}

// 创建上下文菜单
const contextMenu = document.createElement('div');
contextMenu.style.display = 'none';
contextMenu.style.position = 'absolute';

const menuContainer = document.createElement('div');
menuContainer.id = 'menuContainer';

contextMenu.appendChild(menuContainer);
document.body.appendChild(contextMenu);

function hideContextMenu() {
    contextMenu.style.display = 'none';
}
function showContextMenu(event) {
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.display = 'block';
}

document.addEventListener('mouseup', function(event) {
    const selectedText = window.getSelection().toString();
    if (selectedText.length == 0) {
        hideContextMenu();
    } else {
        showContextMenu(event);
    }
});

document.addEventListener('dblclick', function(event) {
    showContextMenu(event);
});

function showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'settings-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'settings-content';

    const textarea = document.createElement('textarea');
    textarea.className = 'settings-textarea';
    textarea.value = current_setting_text;

    const submitButton = document.createElement('button');
    submitButton.className = 'settings-submit';
    submitButton.textContent = 'Apply Settings';

    const settingsDropdown = document.createElement('select');
    settingsDropdown.className = 'settings-dropdown';
    setting_texts.forEach((text, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = text.split('\n')[0]; // Assuming the first line is a title or identifier
        settingsDropdown.appendChild(option);
    });
    settingsDropdown.selectedIndex = setting_current_index;
    settingsDropdown.addEventListener('change', (e) => {
        const selectedIndex = e.target.value;
        textarea.value = setting_texts[selectedIndex];
        if (setting_texts.length <= 1) {
            deleteSettingButton.disabled = true;
        } else {
            deleteSettingButton.disabled = false;
        }
    });

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '10px';  // 两个按钮之间的间距
    const newSettingButton = document.createElement('button');
    newSettingButton.textContent = '添加新功能组';
    newSettingButton.className = 'settings-submit';
    newSettingButton.addEventListener('click', () => {
        textarea.value = setting_new_setting_text;
        setting_texts.push(textarea.value);
        const option = document.createElement('option');
        option.value = setting_texts.length - 1;
        option.text = setting_new_setting_text.split('\n')[0];
        settingsDropdown.appendChild(option);
        settingsDropdown.value = setting_texts.length - 1;
        deleteSettingButton.disabled = false;
    });
    const deleteSettingButton = document.createElement('button');
    deleteSettingButton.textContent = '删除当前功能组';
    deleteSettingButton.className = 'settings-submit';
    deleteSettingButton.addEventListener('click', () => {
        // 如果只剩一个设置，则不进行删除操作
        if (setting_texts.length <= 1) {
            return;
        }

        let toDelete = settingsDropdown.selectedIndex;

        // 从 setting_texts 数组中删除设置
        setting_texts.splice(toDelete, 1);

        // 从 settingsDropdown 中删除对应的选项
        settingsDropdown.remove(toDelete);

        // 如果删除的是第0项或列表中的最后一项，则默认选择第0项
        if (toDelete === 0 || toDelete === setting_texts.length) {
            settingsDropdown.selectedIndex = 0;
            setting_current_index = 0;
        } else {
            // 否则选择之前的项
            settingsDropdown.selectedIndex = toDelete - 1;
            setting_current_index = toDelete - 1;
        }

        // 更新文本区的值为当前选中的设置
        textarea.value = setting_texts[setting_current_index];

        // 保存到 localStorage
        localStorage.setItem(LSID_SETTING_TEXTS, JSON.stringify(setting_texts));
        localStorage.setItem(LSID_SETTING_CURRENT_INDEX, setting_current_index);

        deleteSettingButton.disabled = setting_texts.length <= 1;
    });
    
    // 检查是否只剩一个设置，如果是，则禁用删除按钮
    if (setting_texts.length <= 1) {
        deleteSettingButton.disabled = true;
    }        

    buttonsContainer.appendChild(newSettingButton);
    buttonsContainer.appendChild(deleteSettingButton);
    modalContent.appendChild(settingsDropdown);
    modalContent.appendChild(buttonsContainer); 
    modalContent.appendChild(textarea);
    modalContent.appendChild(submitButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Hide the modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    submitButton.addEventListener('click', () => {
        const selectedSettingIndex = settingsDropdown.selectedIndex;
        if (typeof setting_texts[selectedSettingIndex] === 'undefined') {
            console.error("Trying to save a setting that doesn't exist.");
            return;
        }
    
        setting_texts[selectedSettingIndex] = textarea.value;
        localStorage.setItem(LSID_SETTING_TEXTS, JSON.stringify(setting_texts));
        localStorage.setItem(LSID_SETTING_CURRENT_INDEX, selectedSettingIndex.toString());
        current_setting_text = textarea.value;
        setting_current_index = selectedSettingIndex;
        if (current_setting_text) {
            updateMenuItems();
        }
        modal.remove();
    });
}

let menus = [];
function parseSettingsText(settingsText) {
    menus.length = 0; // Clear the existing array
    const buttonData = settingsText.split("🪄🪄🪄🪄🪄🪄🪄🪄").slice(1);
    buttonData.forEach(data => {
        const lines = data.trim().split("\n");
        if (lines.length >= 2) {
            const name = lines[0];
            const dispatchFlag = name.includes("🚀");
            const content = lines.slice(1).join("\n");
            menus.push([name, content, dispatchFlag]);
        }
    });
}

function updateMenuItems() {
    parseSettingsText(current_setting_text);

    menuContainer.innerHTML = '';
    menus.forEach(menu => {
        menuContainer.appendChild(createMenuItem(menu[0], async function() {
            await sendToGPT(menu[1], window.getSelection().toString(), menu[2]);
        }));
    });

    menuContainer.appendChild(createMenuItem('------', null));

    menuContainer.appendChild(createMenuItem('设置', function() {
        showSettingsModal();
    }));

}


updateMenuItems();