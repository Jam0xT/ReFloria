/*
some notes for myself

effects should be implemented almost the same way as Curses, with some slight differences

an effect automatically expires after some time (which is the duration of the effect instance)
while a curse stays forever unless the curse is dispelled in some special way.

when a new effect instance of the same effect is applied to some effectable,
    if the new effect instance has a higher level than the current effect instance:
        the new effect should completely override the current effect instance
    if the new effect instance has the same level:
        the effect instance with longer duration overrides the one with shorter duration
    if the new effect instance has a lower level:
        nothing should happen

a curse always adds the level of the incoming curse to its current level (until the max level is reached)
 */

interface Effectable {
}

class Effect {
    private static _isReady = false;
    public static get isReady() { return Effect._isReady; }

    public static async readResources() {
    }
}

export {
    Effect,
    Effectable,
}