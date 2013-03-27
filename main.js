/*
 * The MIT License (MIT)
 * Copyright (c) 2013 Lance Campbell. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, regexp: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, XMLHttpRequest, $ */

define(function (require, exports, module) {
    "use strict";
    
    // --- Brackets Modules ---
    var KeyEvent        = brackets.getModule("utils/KeyEvent"),
        EditorManager   = brackets.getModule("editor/EditorManager");
    
    // --- Extension modules ---
    var LoremIpsum = require("LoremIpsum");
    
    // --- Helper functions ---
    function _getWordBefore(document, pos) {
        var line    = document.getLine(pos.line),
            start   = pos.ch,
            end     = pos.ch;
        
        function isWordChar(ch) {
            return (/\w/).test(ch) || ch.toUpperCase() !== ch.toLowerCase();
        }
        
        while (start > 0 && isWordChar(line.charAt(start - 1))) {
            --start;
        }
        
        return document.getRange({line: pos.line, ch: start}, {line: pos.line, ch: end});
    }
    
    // --- Event handlers ---
    function _handleKeyEvent(jqEvent, editor, event) {
        var text    = "",
            start   = 0,
            end     = 0;
        
        if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB)) {
            if (_getWordBefore(editor.document, editor.getCursorPos()) === "lorem") {
                text    = LoremIpsum.getParagraph();
                end     = editor.getCursorPos();
                start   = {line: end.line, ch: end.ch - "lorem".length};
                editor.document.replaceRange(text, start, end);
                event.preventDefault();
            }
        }
    }
    
    function _updateEditorListener(event, newEditor, oldEditor) {
        if (newEditor) {
            $(newEditor).on("keyEvent", _handleKeyEvent);
        }
        
        if (oldEditor) {
            $(oldEditor).off("keyEvent", _handleKeyEvent);
        }
    }
    
    // Update editor listeners any time the active editor changes
    $(EditorManager).on("activeEditorChange", _updateEditorListener);
});
