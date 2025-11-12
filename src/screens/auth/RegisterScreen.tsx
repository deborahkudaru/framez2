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
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Register</Text>

      <TextInput placeholder="Full name" value={fullName} onChangeText={setFullName}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />

      {err ? <Text style={{ color: 'crimson' }}>{err}</Text> : null}

      <TouchableOpacity onPress={onRegister} disabled={loading} style={{ padding: 14, backgroundColor: '#222', borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{loading ? '...' : 'Create account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: 'center' }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
