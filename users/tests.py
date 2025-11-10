from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
import json

User = get_user_model()


class UserRegistrationTestCase(TestCase):
    """Test cases for user registration"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('users:register')
    
    def test_user_registration_success(self):
        """Test successful user registration"""
        data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'test@example.com')
    
    def test_user_registration_password_mismatch(self):
        """Test registration with mismatched passwords"""
        data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'testpass123',
            'password2': 'differentpass'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_registration_duplicate_email(self):
        """Test registration with duplicate email"""
        User.objects.create_user(
            email='test@example.com',
            username='existinguser',
            password='testpass123'
        )
        data = {
            'email': 'test@example.com',
            'username': 'newuser',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTestCase(TestCase):
    """Test cases for user login"""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('users:login')
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
    
    def test_user_login_success(self):
        """Test successful user login"""
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
    
    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserProfileTestCase(TestCase):
    """Test cases for user profile"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.profile_url = reverse('users:profile')
        self.profile_update_url = reverse('users:profile-update')
    
    def test_get_profile_authenticated(self):
        """Test getting profile when authenticated"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
    
    def test_get_profile_unauthenticated(self):
        """Test getting profile when not authenticated"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_update_profile_success(self):
        """Test successful profile update"""
        self.client.force_authenticate(user=self.user)
        data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'bio': 'This is my bio'
        }
        response = self.client.patch(self.profile_update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.bio, 'This is my bio')


class ChangePasswordTestCase(TestCase):
    """Test cases for changing password"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='oldpassword123'
        )
        self.change_password_url = reverse('users:change-password')
        self.client.force_authenticate(user=self.user)
    
    def test_change_password_success(self):
        """Test successful password change"""
        data = {
            'old_password': 'oldpassword123',
            'new_password': 'newpassword123',
            'new_password2': 'newpassword123'
        }
        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))
    
    def test_change_password_wrong_old_password(self):
        """Test password change with wrong old password"""
        data = {
            'old_password': 'wrongpassword',
            'new_password': 'newpassword123',
            'new_password2': 'newpassword123'
        }
        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

