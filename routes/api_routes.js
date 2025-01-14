const express = require('express');
const router = express.Router();
const ApiService = require('../services/api_service');
const { keycloak } = require('../config/keycloak_config');

// Cities routes
router.get('/cities', keycloak.protect(), async (req, res, next) => {
    try {
        const cities = await ApiService.getCities();
        res.json(cities);
    } catch (error) {
        next(error);
    }
});

// Schools routes
router.get('/schools/:city', keycloak.protect(), async (req, res, next) => {
    try {
        const schools = await ApiService.getSchoolsByCity(req.params.city);
        res.json(schools);
    } catch (error) {
        next(error);
    }
});

router.post('/schools', keycloak.protect(), async (req, res, next) => {
    try {
        const result = await ApiService.addSchool(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Machines routes
router.get('/machines/:schoolId/:floor', keycloak.protect(), async (req, res, next) => {
    try {
        const machines = await ApiService.getMachinesBySchoolAndFloor(
            req.params.schoolId,
            req.params.floor
        );
        res.json(machines);
    } catch (error) {
        next(error);
    }
});

router.post('/machines', keycloak.protect(), async (req, res, next) => {
    try {
        const result = await ApiService.addMachine(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.delete('/machines/:machineId', keycloak.protect(), async (req, res, next) => {
    try {
        const result = await ApiService.deleteMachine(req.params.machineId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;