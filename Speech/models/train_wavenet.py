def train_wavenet(model, tacotron_model, dataloader, epochs=20, lr=1e-3, device='cuda'):
    model.to(device)
    tacotron_model.to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    criterion = nn.MSELoss()

    for epoch in range(epochs):
        model.train()
        total_loss = 0

        for batch_mels, batch_texts in dataloader:
            batch_mels, batch_texts = batch_mels.to(device), batch_texts.to(device)

            # Freeze Tacotron2
            with torch.no_grad():
                mel_pred, _ = tacotron_model(batch_texts)

            optimizer.zero_grad()

            # WaveNet training
            wav_pred = model(mel_pred.transpose(1, 2))  # Transpose for WaveNet compatibility
            loss = criterion(wav_pred, batch_mels.transpose(1, 2))  # Transpose target mels

            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss/len(dataloader)}")

    return model
