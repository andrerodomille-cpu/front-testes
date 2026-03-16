// src/utils/fullscreenUtils.ts

export function entrarFullScreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
    } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
    }
}

export function sairFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
    }
}
