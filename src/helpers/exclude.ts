export function exclude<AbstractDto, Key extends keyof AbstractDto>(
    dto: AbstractDto,
    keys: Key[],
): Omit<AbstractDto, Key> {
    for (const key of keys) {
        delete dto[key];
    }

    return dto;
}
