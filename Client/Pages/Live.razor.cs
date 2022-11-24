using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace WebRTCBlazorClientDemo.Client.Pages
{
    public partial class Live : ComponentBase
    {
        [Inject] public IJSRuntime Js { get; set; }

        private string _videoId = "";

        protected override Task OnInitializedAsync() {
            return base.OnInitializedAsync();
        }

        protected override void OnInitialized() {
            _videoId = "video";
            base.OnInitialized();
        }

        protected async override Task OnAfterRenderAsync(bool firstRender) {
            if (firstRender) {
                string streamUrl = "http://localhost:8083/stream/e254df96-2a0e-4bbc-a146-7cb688fa9276/channel/0/webrtc";
                await Js.InvokeAsync<string>("start_WebRTC_Player", streamUrl, _videoId);
            }
            await base.OnAfterRenderAsync(firstRender);
        }
    }
}
