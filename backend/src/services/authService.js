import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../data/users.json');

const JWT_SECRET = process.env.JWT_SECRET || 'dinacity_mendoza_secret_key_2026_super_secure';

export class AuthService {
  constructor() {
    this.users = [];
    this.loaded = false;
  }

  async init() {
    if (this.loaded) return;
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      this.users = JSON.parse(data || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.users = [];
        await this.saveUsers();
      } else {
        console.error('Error cargando archivo de usuarios:', err);
        this.users = [];
      }
    }
    this.loaded = true;
  }

  async saveUsers() {
    try {
      await fs.writeFile(USERS_FILE, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error guardando archivo de usuarios:', err);
      throw new Error('Error interno al persistir usuario');
    }
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
    const { passwordHash, ...safeUser } = user;
    const km = user.loyaltyKm !== undefined ? user.loyaltyKm : 150;
    return {
      ...safeUser,
      loyaltyKm: km,
      loyaltyTier: this.calculateTier(km)
    };
  }

  calculateTier(km) {
    if (km >= 1500) return 'Oro';
    if (km >= 500) return 'Plata';
    return 'Bronce';
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        direccion: user.direccion,
        loyaltyKm: user.loyaltyKm || 150
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  async register({ nombre, apellido, direccion, email, password }) {
    await this.init();

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

    const passCheck = this.validatePassword(password);
    if (!passCheck.valid) {
      throw new Error(passCheck.message);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Comprobar si el email ya está registrado
    const existing = this.users.find((u) => u.email === cleanEmail);
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
    }

    // Hashear contraseña con bcrypt (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      direccion: direccion.trim(),
      email: cleanEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    await this.saveUsers();

    const token = this.generateToken(newUser);
    return {
      user: this.sanitizeUser(newUser),
      token
    };
  }

  async login({ email, password }) {
    await this.init();

    if (!email || !password) {
      throw new Error('Debes proporcionar email y contraseña.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email === cleanEmail);

    if (!user) {
      throw new Error('Email o contraseña incorrectos.');
    }

    // Comparar contraseña con hash
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new Error('Email o contraseña incorrectos.');
    }

    const token = this.generateToken(user);
    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  async verifyToken(token) {
    await this.init();
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = this.users.find((u) => u.id === decoded.id);
      if (!user) return null;
      return this.sanitizeUser(user);
    } catch {
      return null;
    }
  }

  async updateProfile(userId, { nombre, apellido, direccion }) {
    await this.init();
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error('Usuario no encontrado.');
    }

    if (nombre && nombre.trim()) this.users[index].nombre = nombre.trim();
    if (apellido && apellido.trim()) this.users[index].apellido = apellido.trim();
    if (direccion && direccion.trim()) this.users[index].direccion = direccion.trim();

    await this.saveUsers();
    const updated = this.users[index];
    const token = this.generateToken(updated);

    return {
      user: this.sanitizeUser(updated),
      token
    };
  }

  async getLoyaltyProfile(userId) {
    await this.init();
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      // Perfil invitado / anónimo con beneficios base
      return {
        isGuest: true,
        loyaltyKm: 150,
        loyaltyTier: 'Bronce',
        nextTier: 'Plata',
        kmToNextTier: 350,
        progressPercentage: 30,
        benefits: [
          'Acceso a alertas de precios en Mendoza',
          'Cotizaciones directas con WhatsApp pre-cargado'
        ],
        availableVouchers: [
          { id: 'vouch-1', title: '5% OFF en mostrador', store: 'Casas de Carril Rodríguez Peña', minSpend: 40000, code: 'DINACITY-BRONCE-5' }
        ]
      };
    }

    const km = user.loyaltyKm !== undefined ? user.loyaltyKm : 150;
    const tier = this.calculateTier(km);
    let nextTier = 'Plata';
    let kmToNext = 500 - km;
    let progress = Math.min(100, Math.round((km / 500) * 100));

    if (tier === 'Plata') {
      nextTier = 'Oro';
      kmToNext = 1500 - km;
      progress = Math.min(100, Math.round(((km - 500) / 1000) * 100));
    } else if (tier === 'Oro') {
      nextTier = 'Nivel Máximo (Oro VIP)';
      kmToNext = 0;
      progress = 100;
    }

    return {
      isGuest: false,
      userId: user.id,
      userName: `${user.nombre} ${user.apellido}`,
      loyaltyKm: km,
      loyaltyTier: tier,
      nextTier: nextTier,
      kmToNextTier: Math.max(0, kmToNext),
      progressPercentage: progress,
      benefits: tier === 'Oro'
        ? [
            '15% Descuento en mano de obra en talleres mecánicos asociados',
            'Diagnóstico computarizado OBD-II bonificado',
            'Alertas VIP prioritarias de repuestos en liquidación',
            'Atención preferencial por WhatsApp'
          ]
        : tier === 'Plata'
        ? [
            '10% Descuento en mano de obra en talleres mecánicos asociados',
            'Prioridad en búsquedas de mostrador en Mendoza',
            'Alertas semanales de ofertas'
          ]
        : [
            'Acceso a alertas de precios en Mendoza',
            'Cotizaciones directas con WhatsApp pre-cargado'
          ],
      availableVouchers: [
        { id: 'vouch-1', title: 'Cupón Bienvenida Mostrador', store: 'Red Mendoza', discount: 'Bonificación $3.000', code: 'PASA-BIENVENIDO' },
        { id: 'vouch-2', title: 'Líquido Refrigerante Bonificado', store: 'Talleres Asociados', discount: '1L Gratis con Colocación', code: 'PASA-REFRIG' }
      ],
      history: user.loyaltyHistory || [
        { date: user.createdAt || new Date().toISOString(), km: 150, reason: 'Bono de Bienvenida Pasaporte DinAcitY' }
      ]
    };
  }

  async addLoyaltyKm(userId, amount, reason = 'Acción en DinAcitY') {
    await this.init();
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    const currentKm = this.users[index].loyaltyKm || 150;
    const newKm = currentKm + amount;
    this.users[index].loyaltyKm = newKm;

    if (!this.users[index].loyaltyHistory) {
      this.users[index].loyaltyHistory = [];
    }
    this.users[index].loyaltyHistory.unshift({
      date: new Date().toISOString(),
      km: amount,
      reason
    });

    await this.saveUsers();
    return this.getLoyaltyProfile(userId);
  }
}
