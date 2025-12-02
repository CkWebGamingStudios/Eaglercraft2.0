export function raycast(world, origin, direction, maxDist = 6) {
    let x = origin[0], y = origin[1], z = origin[2];

    for (let i = 0; i < maxDist * 10; i++) {
        x += direction[0] * 0.1;
        y += direction[1] * 0.1;
        z += direction[2] * 0.1;

        const bx = Math.floor(x);
        const by = Math.floor(y);
        const bz = Math.floor(z);

        const block = world.getBlock(bx, by, bz);
        if (block !== 0) {
            return { bx, by, bz };
        }
    }

    return null;
}
