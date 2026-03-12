# Calculador Tarifário – Desafio Técnico Hospedin

Mini aplicação em React para simular cálculo de reservas de hospedagem.

## Tecnologias

- React
- Vite
- JavaScript

## Como rodar

```bash
npm install
npm run dev
```
### A aplicação rodará em:
```
http://localhost:5173
```

## Regras implementadas

**Suíte Jardim**
- R$300 por noite
- mínimo de 2 noites
- limpeza R$80

**Chalé Família**
- R$450 por noite
- mínimo de 2 noites
- limpeza R$100

**Fins de semana têm acréscimo de 20%**

**Estadia > 7 noites tem 10% de desconto**

## Decisões técnicas
### A lógica de cálculo foi isolada em uma função calculateTarifario para manter a separação entre regra de negócio e interface.
**A aplicação foi dividida em componentes simples:**
- BookingForm
- PriceSummary

Os dados das acomodações foram centralizados em um módulo para facilitar manutenção futura.
O cálculo percorre cada noite da estadia para aplicar corretamente regras de fim de semana.

Arquitetura simples inspirada em aplicações SaaS reais, separando dados, lógica de negócio e componentes.