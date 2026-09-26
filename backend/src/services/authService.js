import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dinacity_mendoza_secret_key_2026_super_secure';

export class AuthService {
  constructor() {
    // Sentencias preparadas (Prepared Statements) para máxima seguridad y velocidad
    this.queries = {
      findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
      findById: db.prepare('SELECT * FROM users WHERE id = ?'),
      insertUser: db.prepare(`
        INSERT INTO users (id, email, password_hash, nombre, apellido, direccion, telefono, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `),
      updateProfile: db.prepare(`
        UPDATE users
        SET nombre = ?, apellido = ?, direccion = ?, telefono = COALESCE(?, telefono), updated_at = ?
        WHERE id = ?
      `),
      updatePassword: db.prepare(`
        UPDATE users
        SET password_hash = ?, updated_at = ?
        WHERE id = ?
      `)
    };
  }

  // Validador estricto de contraseña segura
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: 'La contraseña es requerida.' };
    }
    if (password.length < 8) {
      return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'La contraseña debe incluir al menos una letra mayúscula.' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'La contraseña debe incluir al menos una letra minúscula.' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'La contraseña debe incluir al menos un número.' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
      return { valid: false, message: 'La contraseña debe incluir al menos un carácter especial (ej: !@#$*).' };
    }
    return { valid: true };
  }

  // Validador de formato de email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase());
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { password_hash, passwordHash, ...safeUser } = user;
    return safeUser;
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        direccion: user.direccion,
        role: user.role || 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  async register({ nombre, apellido, direccion, email, password, telefono = null }) {
    // Validar campos requeridos
    if (!nombre || !nombre.trim()) {
      throw new Error('El nombre es obligatorio.');
    }
    if (!apellido || !apellido.trim()) {
      throw new Error('El apellido es obligatorio.');
    }
    if (!direccion || !direccion.trim()) {
      throw new Error('La dirección en Mendoza es obligatoria.');
    }
    if (!email || !this.validateEmail(email.trim())) {
      throw new Error('Debes ingresar un correo electrónico válido.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Validar robustez de la contraseña
    const pwdCheck = this.validatePassword(password);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.message);
    }

    // Verificar si el email ya existe en la base de datos SQL
    const existing = this.queries.findByEmail.get(cleanEmail);
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
    }

    // Generar Hash bcrypt con 10 rondas de salt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const now = new Date().toISOString();
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Inserción parametrizada protegida contra SQL Injection
    this.queries.insertUser.run(
      userId,
      cleanEmail,
      passwordHash,
      nombre.trim(),
      apellido.trim(),
      direccion.trim(),
      telefono ? telefono.trim() : null,
      'user',
      now,
      now
    );

    const createdUser = this.queries.findById.get(userId);
    const token = this.generateToken(createdUser);

    return {
      user: this.sanitizeUser(createdUser),
      token
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Debes proporcionar email y contraseña.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = this.queries.findByEmail.get(cleanEmail);

    if (!user) {
      throw new Error('Email o contraseña incorrectos.');
    }

    // Comparar contraseña con el hash bcrypt almacenado
    const isMatch = await bcrypt.compare(password, user.password_hash || user.passwordHash);
    if (!isMatch) {
      throw new Error('Email o contraseña incorrectos.');
    }

    const token = this.generateToken(user);
    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = this.queries.findById.get(decoded.id);
      if (!user) return null;
      return this.sanitizeUser(user);
    } catch {
      return null;
    }
  }

  async updateProfile(userId, { nombre, apellido, direccion, telefono }) {
    const user = this.queries.findById.get(userId);
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    const updatedNombre = (nombre && nombre.trim()) ? nombre.trim() : user.nombre;
    const updatedApellido = (apellido && apellido.trim()) ? apellido.trim() : user.apellido;
    const updatedDireccion = (direccion && direccion.trim()) ? direccion.trim() : user.direccion;
    const updatedTelefono = telefono !== undefined ? (telefono ? telefono.trim() : null) : user.telefono;
    const now = new Date().toISOString();

    this.queries.updateProfile.run(
      updatedNombre,
      updatedApellido,
      updatedDireccion,
      updatedTelefono,
      now,
      userId
    );

    const updated = this.queries.findById.get(userId);
    const token = this.generateToken(updated);

    return {
      user: this.sanitizeUser(updated),
      token
    };
  }
}
