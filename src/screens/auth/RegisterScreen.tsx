import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    setLoading(true);
    setErr(null);
    const { error } = await signUp(email.trim(), password);
    if (error) {
      setErr(error);
    } else {
      // Update profile full_name (optional)
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (userId) {
        await supabase.from('profiles').update({ full_name: fullName, email }).eq('id', userId);
      }
      navigation.replace('Login');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center', maxWidth: 440, width: '100%', alignSelf: 'center' }}>
        {/* Header */}
        <View style={{ marginBottom: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 }}>
            Join Framez
          </Text>
          <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center' }}>
            Create your account to get started
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 20 }}>
          {/* Full Name Input */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Full Name
            </Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#9ca3af"
              value={fullName}
              onChangeText={setFullName}
              style={{
                borderWidth: 1.5,
                borderColor: '#e5e7eb',
                padding: 14,
                borderRadius: 12,
                fontSize: 15,
                color: '#1a1a1a',
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>

          {/* Email Input */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Email Address
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1.5,
                borderColor: '#e5e7eb',
                padding: 14,
                borderRadius: 12,
                fontSize: 15,
                color: '#1a1a1a',
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>

          {/* Password Input */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Password
            </Text>
            <TextInput
              placeholder="Create a strong password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={{
                borderWidth: 1.5,
                borderColor: '#e5e7eb',
                padding: 14,
                borderRadius: 12,
                fontSize: 15,
                color: '#1a1a1a',
                backgroundColor: '#FFFFFF',
              }}
            />
            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
              Must be at least 8 characters
            </Text>
          </View>

          {/* Error Message */}
          {err ? (
            <View style={{ 
              backgroundColor: '#fef2f2', 
              padding: 12, 
              borderRadius: 8, 
              borderLeftWidth: 3, 
              borderLeftColor: '#dc2626' 
            }}>
              <Text style={{ color: '#dc2626', fontSize: 14 }}>{err}</Text>
            </View>
          ) : null}

          {/* Register Button */}
          <TouchableOpacity
            onPress={onRegister}
            disabled={loading}
            style={{
              padding: 16,
              backgroundColor: loading ? '#9333ea' : '#7c3aed',
              borderRadius: 12,
              marginTop: 8,
              shadowColor: '#7c3aed',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ 
              color: '#FFFFFF', 
              textAlign: 'center', 
              fontSize: 16, 
              fontWeight: '600',
              letterSpacing: 0.3 
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 15, color: '#6b7280' }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
                <Text style={{ fontSize: 15, color: '#7c3aed', fontWeight: '600' }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}