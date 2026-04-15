# Titan Gym Frontend

Frontend interno de Titan Gym orientado a recepción, construido con React y preparado para integrarse con un backend externo en Spring Boot.

## Puesta en marcha

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Variable de entorno prevista

- `VITE_API_BASE_URL`

## Estructura base

- `src/app`: punto de entrada de la aplicación
- `src/router`: definición del router principal
- `src/layout`: shell global, sidebar y topbar
- `src/pages`: vistas de ruta
- `src/features`: bloques funcionales por dominio
- `src/components/ui`: componentes reutilizables base
- `src/services`: cliente HTTP y servicios orientados a API externa
- `src/utils`: utilidades compartidas
- `src/styles`: tema global y estilos de aplicación
