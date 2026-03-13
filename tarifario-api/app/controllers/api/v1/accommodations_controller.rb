module Api
  module V1
    class AccommodationsController < ApplicationController
      def index
        render json: AccommodationsData::CATALOG.values
      end
    end
  end
end
