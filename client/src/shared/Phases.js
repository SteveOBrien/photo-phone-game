let i = 0;
const PHASES = Object.freeze({
    DISCONNECTED : i++,
    WAITING: i++,
    START: i++,
    DRAWING: i++,
    GUESSING: i++,
    END: i++
});

export default PHASES;