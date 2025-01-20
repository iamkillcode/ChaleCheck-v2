'use client'

import { useState } from 'react'
import { Session } from 'next-auth'
import { Star } from 'lucide-react'
import Layout from '@/components/Layout'
import ReviewForm from '@/components/ReviewForm'
import FavoriteButton from '@/components/FavoriteButton'
import { Restaurant } from '@/types/restaurant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface RestaurantDetailsProps {
  restaurant: Restaurant
  session: Session | null
}

export default function RestaurantDetails({ restaurant, session }: RestaurantDetailsProps) {
  const [currentRestaurant, setCurrentRestaurant] = useState(restaurant)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const fetchRestaurantData = async (id: string) => {
    const response = await fetch(`/api/restaurants/${id}`)
    if (!response.ok) throw new Error('Failed to fetch restaurant')
    return response.json()
  }

  const handleReviewAdded = async () => {
    const updatedRestaurant = await fetchRestaurantData(restaurant.id)
    setCurrentRestaurant(updatedRestaurant)
    setShowReviewForm(false)
  }

  return (
    <Layout>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{currentRestaurant.name}</CardTitle>
              <CardDescription>{currentRestaurant.cuisine || 'Various Cuisine'}</CardDescription>
            </div>
            {session?.user && (
              <FavoriteButton 
                restaurantId={currentRestaurant.id}
                initialIsFavorited={currentRestaurant.favoritedBy?.some(
                  user => user.email === session.user?.email
                ) || false}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentRestaurant.phone || 'Not available'}</dd>
            </div>
            {currentRestaurant.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentRestaurant.description}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Reviews</h2>
              {session?.user && !showReviewForm && (
                <Button 
                  onClick={() => setShowReviewForm(true)}
                  variant="outline"
                >
                  Write a Review
                </Button>
              )}
            </div>

            {showReviewForm && session?.user && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <ReviewForm 
                    restaurantId={currentRestaurant.id} 
                    onReviewAdded={handleReviewAdded}
                  />
                </CardContent>
              </Card>
            )}

            <div className="space-y-6">
              {currentRestaurant.reviews.length > 0 ? (
                currentRestaurant.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={review.user.image || undefined} alt={review.user.name || ''} />
                            <AvatarFallback>{review.user.name?.charAt(0) || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.user.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No reviews yet.</p>
                  {session?.user ? (
                    !showReviewForm && (
                      <Button 
                        onClick={() => setShowReviewForm(true)}
                        variant="outline"
                      >
                        Be the first to review!
                      </Button>
                    )
                  ) : (
                    <p className="text-sm text-gray-500">
                      Sign in to be the first to review this restaurant!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}

