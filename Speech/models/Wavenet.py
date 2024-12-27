class ResidualBlock(nn.Module):
    def __init__(self, residual_channels, dilation_channels, skip_channels, dilation=1):
        super().__init__()
        self.dilated_conv = nn.Conv1d(
            residual_channels, 
            dilation_channels * 2, 
            kernel_size=3, 
            padding=dilation, 
            dilation=dilation
        )
        self.residual_conv = nn.Conv1d(dilation_channels, residual_channels, kernel_size=1)
        self.skip_conv = nn.Conv1d(dilation_channels, skip_channels, kernel_size=1)

    def forward(self, x):
        split = self.dilated_conv(x)
        tanh_out, sigmoid_out = torch.chunk(split, 2, dim=1)
        
        gated_activation = torch.tanh(tanh_out) * torch.sigmoid(sigmoid_out)
        
        residual = self.residual_conv(gated_activation)
        skip = self.skip_conv(gated_activation)
        
        return (x + residual), skip


class WaveNet(nn.Module):
    def __init__(self, 
                 mel_channels=80, 
                 residual_channels=64, 
                 skip_channels=256, 
                 dilation_channels=64, 
                 output_channels=256):
        super().__init__()
        
        # Initial convolution
        self.start_conv = nn.Conv1d(mel_channels, residual_channels, kernel_size=1)
        
        # Dilated convolution layers
        dilation_rates = [1, 2, 4, 8, 16, 32, 64, 128]
        self.dilated_blocks = nn.ModuleList([
            ResidualBlock(residual_channels, dilation_channels, skip_channels, dilation)
            for dilation in dilation_rates
        ])
        
        # Post-processing layers
        self.post_process1 = nn.Conv1d(skip_channels, skip_channels, kernel_size=1)
        self.post_process2 = nn.Conv1d(skip_channels, output_channels, kernel_size=1)
        
    def forward(self, mel_spectrogram):
        # Initial convolution
        x = self.start_conv(mel_spectrogram)
        
        # Skip connection accumulator
        skip_connections = 0
        
        # Process through dilated convolution blocks
        for block in self.dilated_blocks:
            x, skip = block(x)
            skip_connections += skip
        
        # Post-processing
        h = F.relu(skip_connections)
        h = self.post_process1(h)
        h = F.relu(h)
        output = self.post_process2(h)
        
        return output
