import { PartialNested } from "@/game/object";

type EntityType = 'player';

const defaultEntityDef: EntityDef = {
    max_hp: 10,
    maxed_initial_hp: true,
    initial_hp: 10,
    hitbox_radius: 25,
    tag: {}
}

const entityDefs: Record<EntityType, PartialNested<EntityDef>> = {
    'player': {},
}

type EntityDef = {
    max_hp: number;
    maxed_initial_hp: boolean;
    initial_hp: number;
    hitbox_radius: number;
    tag: EntityTags;
}

type EntityTags = {
}

export {
    defaultEntityDef,
    entityDefs,
    EntityDef,
    EntityType
}