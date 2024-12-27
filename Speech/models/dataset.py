
class LJSpeechDataset(Dataset):
    def __init__(self, metadata_path, base_audio_path, sr=22050, n_mels=80, 
                 win_length=1024, hop_length=256, vocab_size=256):
        self.sr = sr
        self.n_mels = n_mels
        self.win_length = win_length
        self.hop_length = hop_length
        self.vocab_size = vocab_size

        self.metadata = pd.read_csv(metadata_path)
        self.metadata['audio_path'] = self.metadata['id'].apply(
            lambda x: os.path.join(base_audio_path, f"{x}.wav")
        )
        self.metadata = self.metadata[self.metadata['audio_path'].apply(os.path.exists)].reset_index(drop=True)

    def __len__(self):
        return len(self.metadata)

    def __getitem__(self, idx):
        row = self.metadata.iloc[idx]
        audio_path = row['audio_path']
        text = row['sentence']

        y, _ = librosa.load(audio_path, sr=self.sr)
        mel_spec = librosa.feature.melspectrogram(y=y, sr=self.sr, n_fft=1024, 
                                                  hop_length=self.hop_length,
                                                  win_length=self.win_length, 
                                                  n_mels=self.n_mels)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        text_encoded = torch.tensor([min(ord(c), self.vocab_size - 1) for c in text], dtype=torch.long)

        return torch.tensor(mel_spec_db.T, dtype=torch.float32), text_encoded

def collate_fn(batch):
    mels, texts = zip(*batch)
    mel_padded = pad_sequence(mels, batch_first=True, padding_value=-20.0)
    text_padded = pad_sequence(texts, batch_first=True, padding_value=0)
    return mel_padded, text_padded
