Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :accommodations, only: [:index]
      post "bookings/calculate", to: "bookings#calculate"
    end
  end
end
