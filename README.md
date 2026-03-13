# Calculador Tarifário – Desafio Técnico Hospedin

Mini aplicação em React para simular cálculo de reservas de hospedagem.

## Tecnologias

- React
- Vite
- JavaScript
- Vitest (testes unitários)

## Como rodar

```bash
npm install
npm run dev
```

A aplicação rodará em `http://localhost:5173`.

## Testes

```bash
npm test                # roda os testes unitários
npm run test:coverage   # gera relatório de cobertura
```

A suíte cobre as regras de negócio de `calculateTarifario`:

- Validações de entrada (datas ausentes, ordem inválida, mínimo de noites)
- Cálculo em dias úteis
- Acréscimo de 20% em fins de semana
- Desconto de 10% para estadias acima de 7 noites

## Backend mockado (Rails API)

A pasta `tarifario-api/` contém uma API Rails que espelha a lógica de cálculo do frontend. Consulte o [tarifario-api/README.md](tarifario-api/README.md) para instruções de setup.

Endpoints:

- `GET  /api/v1/accommodations` — catálogo de acomodações
- `POST /api/v1/bookings/calculate` — cálculo de uma reserva

## Regras implementadas

| Acomodação    | Diária | Mínimo   | Taxa de limpeza |
| ------------- | ------ | -------- | --------------- |
| Suíte Jardim  | R$ 300 | 2 noites | R$ 80           |
| Chalé Família | R$ 450 | 2 noites | R$ 100          |

- **Fins de semana** (sábado e domingo): +20% na diária.
- **Estadia acima de 7 noites**: −10% sobre o total (diárias + limpeza).
- Período inválido ou abaixo do mínimo exibe mensagem de erro.

## Decisões técnicas

A lógica de cálculo foi isolada em `calculateTarifario` para manter separação entre regra de negócio e interface, o que também facilita os testes unitários.

**Componentes:**

- `BookingForm` — formulário controlado
- `PriceSummary` — exibição do resultado

**Estratégias:**

Os dados das acomodações foram centralizados em um módulo para facilitar manutenção futura.

O cálculo percorre cada noite da estadia para aplicar corretamente as regras de fim de semana. A construção de datas foi isolada em `parseDate` para evitar problemas de fuso horário com o construtor UTC do JavaScript.

O utilitário `formatCurrency` usa `Intl.NumberFormat` e pode ser facilmente adaptado para outras moedas.

A estrutura do projeto espelha a separação que uma API Rails teria (dados, serviço, interface), o que permitiu portar a lógica para o backend mockado com mínima adaptação.

_________________________________________________________________________________________________________
Arquitetura simples inspirada em aplicações SaaS reais, separando dados, lógica de negócio e componentes.