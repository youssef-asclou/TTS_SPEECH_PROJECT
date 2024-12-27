def main():
    # Hyperparameters
    VOCAB_SIZE = 256
    N_MELS = 80
    BATCH_SIZE = 4
    EPOCHS_TACOTRON = 20
    EPOCHS_WAVENET = 20
    LR = 1e-3

    # Dataset and DataLoader
    dataset = LJSpeechDataset(
        metadata_path='/kaggle/input/ljspeech-sr16k-dataset/metadata.csv',
        base_audio_path='/kaggle/input/ljspeech-sr16k-dataset/wavs'
    )
    dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True, collate_fn=collate_fn)

    # Models
    tacotron_model = Tacotron2(VOCAB_SIZE, N_MELS)
    wavenet_model = WaveNet(mel_channels=N_MELS)

    # Train Tacotron2
    print("Training Tacotron2...")
    trained_tacotron = train_tacotron2(tacotron_model, dataloader, epochs=EPOCHS_TACOTRON, lr=LR)

    # Train WaveNet
    print("Training WaveNet...")
    trained_wavenet = train_wavenet(wavenet_model, trained_tacotron, dataloader, epochs=EPOCHS_WAVENET, lr=LR)

    # Save models
    torch.save(trained_tacotron.state_dict(), "tacotron2.pth")
    torch.save(trained_wavenet.state_dict(), "wavenet.pth")
    print("Models saved!")
