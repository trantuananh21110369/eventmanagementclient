import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
} from "@microsoft/signalr";

class HubService {
  private connections: { [key: string]: HubConnection } = {};

  getConnection(hubUrl: string): HubConnection {
    if (!this.connections[hubUrl]) {
      const connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .build();

      this.connections[hubUrl] = connection;
    }
    return this.connections[hubUrl];
  }

  async startConnection(hubUrl: string): Promise<HubConnection> {
    const connection = this.getConnection(hubUrl);
    if (connection.state === "Disconnected") {
      await connection.start();
    }
    return connection;
  }

  async stopConnection(hubUrl: string): Promise<void> {
    if (this.connections[hubUrl]) {
      await this.connections[hubUrl].stop();
      delete this.connections[hubUrl];
    }
  }
}

export const hubService = new HubService();
