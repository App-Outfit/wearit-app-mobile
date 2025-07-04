// src/features/onboarding/onboardingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OnboardingState {
    name: string | null;
    gender: string | null;
    age: string | null;
    answers1: string[];
    answers2: string[];
    answers3: string[];
    brands: string[];
    email: string | null;
    password: string | null;
    wardrobeCounts: WardrobeCounts;
}

export interface WardrobeCounts {
    tops: number;
    bottoms: number;
    shoes: number;
    outers: number;
}

const initialState: OnboardingState = {
    name: null,
    gender: null,
    age: null,
    answers1: [],
    answers2: [],
    answers3: [],
    brands: [],
    email: null,
    password: null,
    wardrobeCounts: { tops: 0, bottoms: 0, shoes: 0, outers: 0 },
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setName: (s, a: PayloadAction<string>) => {
            s.name = a.payload;
        },
        setGender: (s, a: PayloadAction<string>) => {
            s.gender = a.payload;
        },
        setAge: (s, a: PayloadAction<string>) => {
            s.age = a.payload;
        },
        setAnswers1: (s, a: PayloadAction<string[]>) => {
            s.answers1 = a.payload;
        },
        setAnswers2: (s, a: PayloadAction<string[]>) => {
            s.answers2 = a.payload;
        },
        setAnswers3: (s, a: PayloadAction<string[]>) => {
            s.answers3 = a.payload;
        },
        setBrands: (s, a: PayloadAction<string[]>) => {
            s.brands = a.payload;
        },
        setEmail: (s, a: PayloadAction<string>) => {
            s.email = a.payload;
        },
        setPassword: (s, a: PayloadAction<string>) => {
            s.password = a.payload;
        },
        setWardrobeCounts: (s, a: PayloadAction<WardrobeCounts>) => {
            s.wardrobeCounts = a.payload;
        },
        resetOnboarding: () => initialState,
    },
});

export const {
    setName,
    setGender,
    setAge,
    setAnswers1,
    setAnswers2,
    setAnswers3,
    setBrands,
    setEmail,
    setPassword,
    setWardrobeCounts,
    resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
