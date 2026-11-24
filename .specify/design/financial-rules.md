# Design — Reglas financieras

## Balance
Balance real:
`balance inicial + movimientos CONFIRMADOS`

PLANIFICADO y CANCELADO no afectan el balance real.

## Monedas
- CRC
- USD
- CRC es la moneda principal por defecto.

Los valores históricos conservan el tipo de cambio utilizado en el momento correspondiente.

## Conceptos
- Tengo = balance real confirmado.
- Apartado = compromisos/metas/deuda de tarjeta según reglas definidas.
- Libre = Tengo − Apartado.

Tengo y Libre no deben almacenarse como saldos editables.

## Movimientos
Tipos definidos:
- INGRESO
- GASTO
- TRANSFERENCIA
- PRESTAMO_RECIBIDO
- PRESTAMO_DADO
- COBRO_DEUDA
- PAGO_DEUDA

Estados:
- PLANIFICADO
- CONFIRMADO
- CANCELADO

## Tarjetas
Crédito:
- compra = gasto + aumento de deuda;
- pago = disminución de disponible + disminución de deuda;
- no duplicar la compra como gasto al registrar el pago;
- intereses/cargos = gasto real + aumento de deuda.

No almacenar número completo, CVV ni PIN.
