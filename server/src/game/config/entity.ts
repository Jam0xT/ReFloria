import { PartialNested } from "@/game/object";

type EntityType = 'player';

const defaultEntityDef: EntityDef = {
    max_hp: 10,
    maxed_initial_hp: true,
    initial_hp: 10,
    tag: {

    }
}

const entityDefs: Record<EntityType, PartialNested<EntityDef>> = {
    'player': {

    }
}

interface EntityDef {
    max_hp: number;
    maxed_initial_hp: boolean;
    initial_hp: number;
    tag: EntityTags;
}

interface EntityTags {
}

export {
    entityDefs,
    EntityDef,
    EntityType
}