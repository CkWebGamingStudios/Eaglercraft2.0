export default class AudioSystem {
    static ctx = null;

    static init() {
        AudioSystem.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    static playBeep() {
        let osc = AudioSystem.ctx.createOscillator();
        osc.frequency.value = 440;
        osc.connect(AudioSystem.ctx.destination);
        osc.start();
        osc.stop(AudioSystem.ctx.currentTime + 0.1);
    }
}
