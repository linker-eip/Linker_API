import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const bool = await bcrypt.compare(password, hashedPassword);
    return bool;
  }