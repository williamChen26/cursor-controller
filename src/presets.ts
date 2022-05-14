import { genSvgUrl } from './utils';

export const crosshairUrl =
    'https://cdn.dancf.com/fe-assets/img/6f798e5b13603b87580740d0395d6136.svg';

export type TCursorDefinitionImage = string | ((args: any) => Promise<string>);

export interface ICursorDefinition {
    image: TCursorDefinitionImage;
    top: number;
    left: number;
    replacement: string;
}

/**
 * 基础光标
 * @memberof svg
 */
export const CommonCursorPreset = {
    /**
     * 光标
     * @type {Object}
     * @readonly
     * @enum
     */
    default: {
        /**
         * 自定义光标svg
         * @type {object}
         */
        image: ' https://cdn.dancf.com/fe-assets/img/c7ca2e93ad449598be9ead2d132dd05b.svg',
        /**
         * 光标y轴中心点定位
         * @type {number}
         */
        top: 2,
        /**
         * 光标x轴中心点定位
         * @type {number}}
         */
        left: 6,
        /**
         * 系统可替代光标样式
         * @type {string}
         */
        replacement: 'default',
    },
    crosshair: {
        image: crosshairUrl,
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    move: {
        image: 'https://cdn.dancf.com/fe-assets/img/36bbf5e4d1323798014eb8257aef419b.svg',
        top: 16,
        left: 16,
        replacement: 'move',
    },
    copy: {
        image: 'https://cdn.dancf.com/fe-assets/img/1b01ded2baf47481de904a1df530b8ee.svg',
        top: 2,
        left: 6,
        replacement: 'copy',
    },
    notAllowed: {
        image: 'https://cdn.dancf.com/fe-assets/img/b9956bfa9d69be8d4d9f90745aee1e55.svg',
        top: 2,
        left: 6,
        replacement: 'not-allowed',
    },
    ewResize: {
        image: 'https://cdn.dancf.com/fe-assets/img/7e6be5a8633602679325c01e745e53ef.svg',
        top: 16,
        left: 16,
        replacement: 'ew-resize',
    },
    nsResize: {
        image: 'https://cdn.dancf.com/fe-assets/img/4f7515dd177541d307de562bd6ee8f07.svg',
        top: 16,
        left: 16,
        replacement: 'ns-resize',
    },
    neswResize: {
        image: 'https://cdn.dancf.com/fe-assets/img/13cfd89732053891fab7d23547a6d4f0.svg',
        top: 16,
        left: 16,
        replacement: 'nesw-resize',
    },
    nwseResize: {
        image: 'https://cdn.dancf.com/fe-assets/img/8f76b0abb0a62213ab3795d3ebaf3c3e.svg',
        top: 16,
        left: 16,
        replacement: 'nwse-resize',
    },
    pointer: {
        image: 'https://cdn.dancf.com/fe-assets/img/e8b4d2d611f6852ee51a25b79aca00fd.svg',
        top: 2,
        left: 6,
        replacement: 'pointer',
    },
    text: {
        image: 'https://cdn.dancf.com/fe-assets/img/6ad6f620a73146c9b40b8df9d3c3239c.svg',
        top: 16,
        left: 16,
        replacement: 'text',
    },
    rotator: {
        image: 'https://cdn.dancf.com/fe-assets/img/b7f2dba7d2a5c7631de984f35d15f2ee.svg',
        top: 16,
        left: 16,
        replacement: 'pointer',
    },
    grab: {
        image: 'https://cdn.dancf.com/fe-assets/img/1426cc62fc11c7546fdd6d76c502f549.svg',
        top: 16,
        left: 16,
        replacement: 'grab',
    },
    grabbing: {
        image: 'https://cdn.dancf.com/fe-assets/img/7308db6f07c788152f72c988c338edcd.svg',
        top: 16,
        left: 16,
        replacement: 'grabbing',
    },
    none: {
        image: '',
        top: 0,
        left: 0,
        replacement: 'none',
    },
};

interface IShapeProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}

export const ShapeCursorPreset = {
    rect: {
        image: (props: IShapeProps) =>
            genSvgUrl('https://cdn.dancf.com/fe-assets/img/8366aa2acd4ca7701da22c5514126df9.svg', [
                props.fill,
                props.stroke,
            ]),
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    arrow: {
        image: (props: IShapeProps) =>
            genSvgUrl('https://cdn.dancf.com/fe-assets/img/f5f4269784a88570d4ce8e2624c835fe.svg', [
                props.fill,
                props.stroke,
            ]),
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    ellipse: {
        image: (props: IShapeProps) =>
            genSvgUrl('https://cdn.dancf.com/fe-assets/img/ec21a1d223fc1979098b2ff56fd35e56.svg', [
                props.stroke,
                props.fill,
            ]),
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    triangle: {
        image: (props: IShapeProps) =>
            genSvgUrl('https://cdn.dancf.com/fe-assets/img/db0dd2670d9ec35e74cbf3a0a85eadc7.svg', [
                props.fill,
                props.stroke,
            ]),
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    line: {
        image: (props: IShapeProps) =>
            genSvgUrl('https://cdn.dancf.com/fe-assets/img/2df66e8e2c1c227434af07c87e25fdd9.svg', [
                props.stroke,
                props.fill,
            ]),
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    brush: {
        image: (props: IShapeProps) =>
            genSvgUrl('https://cdn.dancf.com/fe-assets/img/6660fb88273018b504da31c1e109f0e1.svg', [
                props.stroke,
                props.fill,
            ]),
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    mosaicRect: {
        image: (props: IShapeProps) =>
            genSvgUrl('https://cdn.dancf.com/fe-assets/img/8366aa2acd4ca7701da22c5514126df9.svg', [
                props.fill,
                props.stroke,
            ]),
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    mosaicEllipse: {
        image: (props: IShapeProps) =>
            genSvgUrl('https://cdn.dancf.com/fe-assets/img/ec21a1d223fc1979098b2ff56fd35e56.svg', [
                props.stroke,
                props.fill,
            ]),
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    mosaicBrush: {
        image: (props: IShapeProps) => {
            const width = props.strokeWidth || 12;
            const scale = Math.max(width / 12, 0.5);
            const svg = genSvgUrl(
                'https://cdn.dancf.com/fe-assets/img/0f56335bbdfb75be6f3e70b9d095612f.svg',
                [String(scale)],
            );
            return svg;
        },
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    markTips: {
        image: crosshairUrl,
        top: 16,
        left: 16,
        replacement: 'crosshair',
    },
    'update-anchor': {
        image: 'https://cdn.dancf.com/fe-assets/img/f81db36e19c0c2f31bc0f06bf7c00313.svg',
        top: 4,
        left: 12,
        replacement: 'default',
    },
    'fit-anchor': {
        image: 'https://cdn.dancf.com/fe-assets/img/ae82b7ee3da06c1c4e9a5038612092b1.svg',
        top: 4,
        left: 12,
        replacement: 'default',
    },
    'add-anchor': {
        image: 'https://cdn.dancf.com/fe-assets/img/f58873147807aea028efb32ebab1d071.svg',
        top: 4,
        left: 12,
        replacement: 'default',
    },
};
