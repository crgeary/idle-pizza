export function $<E extends Element = Element>(e: string): E | null {
    return document.querySelector(e);
}
