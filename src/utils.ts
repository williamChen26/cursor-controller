import loader from '../loader';
import { createCanvas } from '../canvas';
import { canvasToBlob } from '../binary';
import { TCursorDefinitionImage } from './presets';
import { isWebkit } from '../ua';
import { defaultCursorContent } from './constants';

/**
 * 获取具备data-cursors属性的node
 * @param {Object} target node
 * @returns {Object} node
 */
export function getTarget(target: HTMLElement): HTMLElement {
    // 获取自定义属性cursor，没有则往父节点查询
    if (!target.dataset?.cursor && target.parentNode) {
        return getTarget(target.parentNode as HTMLElement);
    } else {
        return target;
    }
}

export interface ICursorValueOptions {
    imageSets?: ICursorImageSet[];
    left?: number;
    top?: number;
    replacement?: string;
}

export interface IUpdateCursorStyleNodeData extends ICursorValueOptions {
    cacheKey: string;
}

/**
 * 生成光标样式值
 */
export function getCursorCssValue(opt: ICursorValueOptions) {
    const { imageSets, left = 0, top = 0, replacement = 'default' } = opt;
    const imageset = imageSets.map((s) => `url('${s.url}') ${s.resolution}x`).join(',');
    let v = `image-set(${imageset}) ${left} ${top}`;
    if (isWebkit()) v = `-webkit-${v}`;
    return `${v}, ${replacement}`;
}

export interface IRenderCursorOptions {
    image: TCursorDefinitionImage;
    rotate?: number;
    args?: any;
}

export interface ICursorImageSet {
    url: string;
    resolution: number;
}

const _rotate = (canvas: HTMLCanvasElement, rotate: number) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.translate(width / 2, height / 2);
    ctx.rotate((Math.PI / 180) * (360 - rotate));
    ctx.translate(-width / 2, -height / 2);
};

/**
 * 渲染cursor
 */
export async function renderCursor(opt: IRenderCursorOptions): Promise<ICursorImageSet[]> {
    const { image, args, rotate } = opt;

    let url = image as string;
    if (typeof image !== 'string') {
        url = await image(args);
    }

    // webkit 返回2种分辨率svg url
    if (isWebkit() && !rotate) {
        const url1x = await genSvgUrl(url, [], 1);
        return [
            { url, resolution: 2 },
            { url: url1x, resolution: 1 },
        ];
    }

    // 非webkit或旋转返回2种分辨率canvas
    const img = await loader._loadImage(url);
    const c1 = createCanvas(img.width / 2, img.height / 2) as HTMLCanvasElement;
    const c2 = createCanvas(img.width, img.height) as HTMLCanvasElement;
    const ctx1 = c1.getContext('2d');
    const ctx2 = c2.getContext('2d');

    if (rotate) {
        _rotate(c1, rotate);
        _rotate(c2, rotate);
    }

    ctx1.drawImage(img, 0, 0, c1.width, c1.height);
    ctx2.drawImage(img, 0, 0, c2.width, c2.height);

    URL.revokeObjectURL(url);

    return [
        { url: URL.createObjectURL(await canvasToBlob(c1)), resolution: 1 },
        { url: URL.createObjectURL(await canvasToBlob(c2)), resolution: 2 },
    ];
}

/**
 * 生成模板svg url
 */
export async function genSvgUrl(url: string, args: string[], dpr = 2) {
    let svg = await getTemplateSvg(url, args);
    if (dpr !== 2) {
        svg = svg.replace('width="64"', 'width="32"');
        svg = svg.replace('height="64"', 'height="32"');
    }
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
}

/**
 * 获取远程模板svg
 */
export async function getTemplateSvg(url: string, args: (string | number)[] = []) {
    let content = '';
    try {
        content = await loader.loadXMLStr(url);
    } catch {
        content = defaultCursorContent;
    }

    args.forEach((d, i) => {
        content = content.replace(`{${i}}`, d.toString());
    });
    return content;
}
