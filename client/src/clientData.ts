export const client = {
    set playerName(name: string) {
        localStorage.setItem("name", name);
    },
    get playerName() {
        return localStorage.getItem("name") ?? 'Flower';
    },
}
