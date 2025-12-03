// routes/iot_led.js
import { Router } from 'express';
import db from '../db/knex.js';

const router = Router();

// GET /api/leds -> devuelve todos los LEDs
router.get('/', async (req, res) => {
    try {
        const rows = await db("leds").select("id", "name", "state");
        const leds = rows.map((r) => ({
            ...r,
            state: !!r.state, // convierte 0/1 a false/true
        }));
        res.json({ data: leds }); // <-- envolvemos en objeto para cumplir con la especificación
    } catch (error) {
        console.error("Error al obtener LEDs:", error);
        res.status(500).json({ error: "Error al obtener LEDs" });
    }
});

// GET /api/leds/:id -> un LED específico
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const led = await db("leds").where({ id }).first();
        if (!led) return res.status(404).json({ error: "LED no encontrado" });
        res.json({
            ...led,
            state: !!led.state,
        });
    } catch (error) {
        console.error("Error al obtener LED:", error);
        res.status(500).json({ error: "Error al obtener LED" });
    }
});

// PUT /api/leds/:id -> cambiar estado (true/false)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { state } = req.body; // true/false

    if (typeof state !== 'boolean') {
        return res.status(400).json({ error: 'state debe ser boolean' });
    }

    try {
        const exists = await db("leds").where({ id }).first();
        if (!exists) {
            return res.status(404).json({ error: 'LED no encontrado' });
        }

        await db("leds")
            .where({ id })
            .update({ state, updated_at: db.fn.now() });

        const updated = await db("leds").where({ id }).first();

        res.json({
            ...updated,
            state: !!updated.state,
        });
    } catch (error) {
        console.error("Error al actualizar LED:", error);
        res.status(500).json({ error: 'Error al actualizar LED' });
    }
});

export default router;
