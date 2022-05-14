import type { IVPEditor } from '@gaoding/editor-framework/src/types/editor';
import { cloneDeep, isEqual } from 'lodash';
import { CommonCursorPreset, ShapeCursorPreset, ICursorDefinition } from './presets';
import {
    getCursorCssValue,
    getTarget,
    ICursorImageSet,
    IUpdateCursorStyleNodeData,
    renderCursor,
} from './utils';

export interface ICursorOptions {
    rotate?: number;
    args?: any;
    tip?: string;
}

export interface ICursorKeyOptions {
    rotate?: number;
    cursor?: string;
}

interface ICacheCursorInfo extends ICursorOptions {
    clsName: string;
    imageSets: ICursorImageSet[];
    rule: CSSStyleRule;
}

export default class {
    /**
     * editor实例
     * @type {Object}
     */
    editor: IVPEditor;

    /**
     * 当前目标node
     */
    target?: HTMLElement = null;

    /**
     * 是否完全受外部控制
     */
    private _fixed = false;

    /**
     * 缓存
     * @type {Object}
     */
    private readonly _cacheCursor = new Map<string, ICacheCursorInfo>();

    /**
     * 支持光标类型
     * @type {Object}
     */
    private readonly _cursorMap = new Map<string, ICursorDefinition>();

    private _styleElement?: HTMLStyleElement;
    private _$tip?: HTMLDivElement;

    private _onTipMousemove?: (e: MouseEvent) => void;

    currentCursor?: string;

    constructor(editor: IVPEditor) {
        this._loadCursorDefinition();
        this.editor = editor;
        this._onMouseEvent();
        this._initTipNode();
    }

    /**
     * 载入编辑器光标信息
     */
    private _loadCursorDefinition() {
        const cursorMap = { ...CommonCursorPreset, ...ShapeCursorPreset };
        Object.keys(cursorMap).forEach((key) => {
            this._cursorMap.set(key, cursorMap[key]);
        });
    }

    /**
     * 初始化提示节点
     */
    private _initTipNode() {
        const $div = document.createElement('div');
        Object.assign($div.style, {
            position: 'fixed',
            'z-index': 9,
            padding: '8px 12px',
            background: '#33383E',
            color: '#E8EAEC',
            'font-size': '14px',
            'font-weight': 400,
            'border-radius': '4px',
            'pointer-events': 'none',
            transform: 'translate(-50%, -50px)',
            display: 'none',
        });
        document.body.appendChild($div);
        this._$tip = $div;
        this._onTipMousemove = (e) => {
            Object.assign(this._$tip.style, {
                left: e.pageX + 'px',
                top: e.pageY + 'px',
            });
        };
    }

    /**
     * 显示跟随光标tip
     */
    private _showTip(tip: string) {
        if (this._$tip.style.display === 'block') return;
        document.body.addEventListener('mousemove', this._onTipMousemove);
        this._$tip.innerText = tip;
        this._$tip.style.display = 'block';
    }

    private _hideTip() {
        document.body.removeEventListener('mousemove', this._onTipMousemove);
        this._$tip.style.display = 'none';
    }

    /**
     * 设置自定义光标类名到head <style>
     * @param {*} url imgUrl
     * @param {*} density 设备屏幕dpr，dpr为1时，图片精密度无需调节，为2时，需要通过mage-set提高精密度
     * @param {*} cacheKey 保存缓存key值
     * @param {*} location 光标中心点定位
     * @param {*} replacement 可替换光标
     * @returns clsName
     */
    private _updateStyleNode(opt: IUpdateCursorStyleNodeData) {
        // 生成随机的cssName
        const clsName = `_set_cursor_${Math.random().toString(32).slice(-10)}`.replace(/\./g, '-');
        // 创建style标签
        if (!this._styleElement) {
            this._styleElement = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(this._styleElement);
        }
        const sheet = this._styleElement.sheet;
        sheet.insertRule(`.${clsName} { cursor: ${getCursorCssValue(opt)}; }`);
        this._cacheCursor.set(opt.cacheKey, {
            clsName,
            imageSets: opt.imageSets,
            rule: sheet.cssRules[0] as CSSStyleRule,
        });
        return clsName;
    }

    /**
     * 设置target光标类名
     * @param clsName
     */
    private _setTargetCursorClsName(clsName: string, target = this.target) {
        // 刷新dom cursor类名
        if (target?.className) {
            const currentClass = this.target.className.split(' ').filter((item) => {
                return /^_set_cursor_/.test(item);
            });
            target.classList.remove(currentClass[0]);
        }
        target && this.target.classList.add(clsName);
    }

    /**
     * 支持DOM上添加data-cursor属性设定光标
     * data-cursor='name'| 'cursor:name,rotate:value'
     */
    private _handleEvent(e: { target: HTMLElement }) {
        this.target = getTarget(e.target);
        if (this._fixed) return;

        const params = this.target?.dataset?.cursor;
        const cursorProps: ICursorKeyOptions = {};
        if (!params) {
            return;
        } else if (params.indexOf(',') === -1) {
            cursorProps.cursor = params;
        } else {
            const arr = params.split(',');
            arr.forEach((item) => {
                cursorProps[item.split(':')[0].trim()] = item.split(':')[1].trim();
            });
        }
        this.toggleCursor(cursorProps.cursor, { rotate: cursorProps.rotate });
    }

    // 创建changeCursor自定义事件
    private _onMouseEvent() {
        this.editor.$events.$on('base.changeCursor', this._handleEvent.bind(this));
    }

    // 销毁changeCursor自定义事件
    private _offMouseEvent() {
        this.editor.$events.$off('base.changeCursor', this._handleEvent.bind(this));
    }

    /**
     * 获取光标缓存key(可能带旋转)
     */
    private _getCursorKey(data: ICursorKeyOptions) {
        const cursor = data.cursor || 'default';
        // 初始化旋转角度
        let rotate = 0;
        if (data.rotate) {
            rotate = data?.rotate >= 0 ? data.rotate : 360 + Number(data.rotate || 0);
        }

        // dir以10度为一区域且取每块区域的中间角度
        const dir = Math.floor(Math.abs(rotate - 5) / 10) || 0;

        const key = !dir ? cursor : `${cursor}_${dir}`;
        return key;
    }

    /**
     * 是否需要重新渲染光标
     */
    private _shouldRerenderCursor(opt: ICursorOptions, cache: ICacheCursorInfo) {
        return !isEqual(opt.args, cache.args) || opt.rotate !== cache.rotate;
    }

    /**
     * 新建光标
     */
    private async _createCursor(key: string, definition: ICursorDefinition, opt: ICursorOptions) {
        const imageSets = await renderCursor({ image: definition.image, ...opt });
        const clsName = this._updateStyleNode({
            ...definition,
            imageSets,
            cacheKey: key,
        });
        this._setTargetCursorClsName(clsName);
    }

    /**
     * 更新缓存光标
     */
    private async _updateCacheCursor(
        cache: ICacheCursorInfo,
        definition: ICursorDefinition,
        opt: ICursorOptions,
    ) {
        this._setTargetCursorClsName(cache.clsName);
        if (!this._shouldRerenderCursor(opt, cache)) return;
        const imageSets = await renderCursor({ image: definition.image, ...opt });
        const rule = cache.rule;
        rule.style.cursor = getCursorCssValue({
            ...definition,
            imageSets,
        });
        cache.imageSets.forEach((s) => URL.revokeObjectURL(s.url));
        Object.assign(cache, {
            imageSets,
            ...cloneDeep(opt),
        });
    }

    /**
     * 切换光标
     * @param name
     */
    async toggleCursor(name: string, opt: ICursorOptions = {}) {
        const key = this._getCursorKey({ cursor: name, rotate: opt.rotate });
        this.currentCursor = key;
        const cache = this._cacheCursor.get(key);
        const cursorDefinition = this._cursorMap.get(name);
        if (cache) this._updateCacheCursor(cache, cursorDefinition, opt);
        else this._createCursor(key, cursorDefinition, opt);
        if (opt.tip) this._showTip(opt.tip);
        else this._hideTip();
    }

    /**
     * 固定光标
     */
    fixedCursor(name: string, opt: ICursorOptions = {}) {
        this._fixed = true;
        this.toggleCursor(name, opt);
    }

    /**
     * 取消固定
     * name: 取消后切换的光标
     */
    cancelFixed(name?: string) {
        this._fixed = false;
        name && this.toggleCursor(name);
    }
}
