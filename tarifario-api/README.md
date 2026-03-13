# Tarifário API

Backend Rails API-only que expõe as regras de cálculo de reservas do Calculador Tarifário.

## Requisitos

- Ruby 3.3+
- Rails 7.2+

## Setup

```bash
# 1. Instalar Rails (se ainda não tiver)
gem install rails

# 2. A partir da raiz do projeto (calculador-tarifario/), gerar a app base
#    --api                → modo API-only (sem views)
#    --skip-active-record → sem banco de dados
#    --skip-test          → sem minitest (não usado aqui)
#    -f                   → sobrescreve a pasta tarifario-api/ existente
rails new tarifario-api --api --skip-active-record --skip-test -f

# 3. Entrar na pasta
cd tarifario-api

# 4. Adicionar rack-cors e instalar dependências
bundle add rack-cors
bundle install
```

O `rails new -f` irá resetar alguns arquivos. Restaure os arquivos customizados deste repositório (já presentes na pasta `tarifario-api/`):

| Arquivo                                               | O que faz                      |
| ----------------------------------------------------- | ------------------------------ |
| `config/routes.rb`                                    | Define as rotas da API         |
| `config/initializers/cors.rb`                         | Libera `localhost:5173` (Vite) |
| `app/controllers/api/v1/accommodations_controller.rb` | Lista acomodações              |
| `app/controllers/api/v1/bookings_controller.rb`       | Calcula reservas               |
| `app/data/accommodations_data.rb`                     | Catálogo mockado em memória    |

```bash
# 5. Iniciar o servidor
rails server
```

A API rodará em `http://localhost:3000`.

## Endpoints

### `GET /api/v1/accommodations`

Retorna o catálogo de acomodações.

```json
[
  {
    "id": "suiteJardim",
    "name": "Suíte Jardim",
    "base_price": 300,
    "min_nights": 2,
    "cleaning_fee": 80
  },
  {
    "id": "chaleFamilia",
    "name": "Chalé Família",
    "base_price": 450,
    "min_nights": 2,
    "cleaning_fee": 100
  }
]
```

### `POST /api/v1/bookings/calculate`

Calcula o total de uma reserva.

**Body:**

```json
{
  "accommodation": "suiteJardim",
  "check_in": "2026-03-16",
  "check_out": "2026-03-18",
  "adults": 2
}
```

**Response:**

```json
{
  "accommodation_name": "Suíte Jardim",
  "nights": 2,
  "daily_rate": 300,
  "daily_total": 600.0,
  "cleaning_fee": 80,
  "total": 680.0
}
```

## Estrutura

```
app/
  controllers/
    api/
      v1/
        accommodations_controller.rb   # lista acomodações
        bookings_controller.rb         # lógica de cálculo (espelho do calculateTarifario.js)
  data/
    accommodations_data.rb             # catálogo mockado em memória
config/
  initializers/
    cors.rb                            # libera http://localhost:5173 (Vite)
  routes.rb
```

Sem banco de dados — os dados vivem em `AccommodationsData::CATALOG`. Para evoluir para persistência real, basta criar models ActiveRecord e substituir as referências ao módulo.
