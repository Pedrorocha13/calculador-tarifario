module Api
  module V1
    class BookingsController < ApplicationController
      def calculate
        accommodation = AccommodationsData::CATALOG[params[:accommodation]]

        unless accommodation
          return render json: {error: "Acomodação não encontrada."}, status: :unprocessable_entity
        end

        check_in = Date.parse(params[:check_in])
        check_out = Date.parse(params[:check_out])
        nights = (check_out - check_in).to_i

        if nights <= 0
          return render json: {error: "Check-out deve ser após o check-in."}, status: :unprocessable_entity
        end

        if nights < accommodation[:min_nights]
          return render json: {
            error: "Estadia mínima de #{accommodation[:min_nights]} noites."
          }, status: :unprocessable_entity
        end

        daily_total = (0...nights).sum do |i|
          date = check_in + i
          (date.saturday? || date.sunday?) ? accommodation[:base_price] * 1.2 : accommodation[:base_price]
        end

        total = daily_total + accommodation[:cleaning_fee]
        total *= 0.9 if nights > 7

        render json: {
          accommodation_name: accommodation[:name],
          nights: nights,
          daily_rate: accommodation[:base_price],
          daily_total: daily_total.round(2),
          cleaning_fee: accommodation[:cleaning_fee],
          total: total.round(2)
        }
      end
    end
  end
end
