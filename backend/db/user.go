package db

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username string             `json:"username"`
	Password string             `json:"password"`
	Email    string             `json:"email"`
}

func CountUsersWithEmail(ctx context.Context, email string) (int64, error) {
	filter := bson.M{"email": email}
	count, err := db.Collection("users").CountDocuments(ctx, filter)
	if err != nil {
		return -1, err
	}
	return count, nil
}

func CreateUser(ctx context.Context, newUser User) error {
	_, err := db.Collection("users").InsertOne(ctx, newUser)
	return err
}

func GetUserByEmail(ctx context.Context, email string) (*User, error) {
	user := new(User)
	filter := bson.M{"email": email}
	err := db.Collection("users").FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return nil, err
	}
	return user, nil
}
