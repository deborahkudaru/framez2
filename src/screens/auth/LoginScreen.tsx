import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export default function LoginScreen({ navigation }: NativeStackScreenProps<any>) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    setErr(null);
    const { error } = await signIn(email.trim(), password);
    if (error) setErr(error);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      {err ? <Text style={{ color: 'crimson' }}>{err}</Text> : null}

      <TouchableOpacity onPress={onLogin} disabled={loading} style={{ padding: 14, backgroundColor: '#222', borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{loading ? '...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{ textAlign: 'center' }}>No account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
