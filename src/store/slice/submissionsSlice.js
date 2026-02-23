import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  data: [],
  loading: false,
  error: null,
  sendLoading: false,
  sendError: null,
  sendSuccess: false,
};

// ── GET submissions ──
export const SubmissionsGet = createAsyncThunk(
  "submissions/get",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data: profile } = getState().profile;

      const res = await api({
        url: `/submissions/${profile._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Ma'lumotlarni yuklab bo'lmadi"
      );
    }
  }
);

// ── POST homework ──
export const sendHomework = createAsyncThunk(
  "submissions/sendHomework",
  async ({ link, comment }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await api({
        url: "/submissions/postHomeWork",
        method: "POST",
        data: {
          HwLink: link.trim(),
          description: comment.trim(),
        },
      });

      return res.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data?.message || `Server xatosi: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue("Serverga ulanib bo'lmadi. Internetni tekshiring.");
      }
      return rejectWithValue(error.message || "Noma'lum xatolik yuz berdi");
    }
  }
);

const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    clearSubmissions: (state) => {
      state.data = [];
      state.error = null;
    },
    resetSendState: (state) => {
      state.sendLoading = false;
      state.sendError = null;
      state.sendSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // GET
    builder
      .addCase(SubmissionsGet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SubmissionsGet.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(SubmissionsGet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // POST
    builder
      .addCase(sendHomework.pending, (state) => {
        state.sendLoading = true;
        state.sendError = null;
        state.sendSuccess = false;
      })
      .addCase(sendHomework.fulfilled, (state) => {
        state.sendLoading = false;
        state.sendSuccess = true;
      })
      .addCase(sendHomework.rejected, (state, action) => {
        state.sendLoading = false;
        state.sendError = action.payload;
      });
  },
});

export const { clearSubmissions, resetSendState } = submissionsSlice.actions;
export default submissionsSlice.reducer;