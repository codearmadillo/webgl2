function createElementWithClassList(tag: string, classList: string[], content?: string) {
    const e = document.createElement(tag);
    e.classList.add(...classList);
    if (content) {
        e.textContent = content;
    }
    return e;
}
function getDebugOrThrow() {
    const debug = document.getElementById('debug-panel');
    if (!debug) {
        throw new Error('Cannot find debug panel');
    }
    return debug;
}
export function createRangeDebugTool(title: string, name: string, value: number, min: number, max: number, onChange: (value: number, scope: 'model' | 'view', modifier: 'rotation' | 'position', axis: 'x' | 'y' | 'z') => any) {
    const debug = getDebugOrThrow();
    const wrapper = createElementWithClassList('div', ['group']);

    if (value > max) {
        value = max;
    }
    if (value < min) {
        value = min;
    }

    const titleElement = createElementWithClassList('h3', ['group-title'], title)
    const slider = createElementWithClassList('input', ['group-slider']) as HTMLInputElement;
    slider.type = 'range';
    slider.id = name;
    slider.name = name;
    slider.min = min.toString();
    slider.max = max.toString();
    slider.value = value.toString();

    slider.addEventListener('change', () => {
        valueElement.textContent = slider.value;
        const [ scope, modifier, axis ] = name.split('-');
        onChange(slider.value, scope as any, modifier as any, axis as any);
    });

    const valueElement = createElementWithClassList('div', ['group-range-value'], value.toString());

    wrapper.append(
        titleElement,
        slider,
        valueElement
    )
    debug.append(wrapper);
}
export function createDebugToolSpacing() {
    const debug = getDebugOrThrow();
    const wrapper = createElementWithClassList('div', ['spacing']);
    debug.append(wrapper);
}