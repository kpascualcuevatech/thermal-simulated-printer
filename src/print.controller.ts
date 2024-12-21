import { Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { printer as ThermalPrinter, types as PrinterTypes } from 'node-thermal-printer';

@Controller()
export class PrintController {

  @Post('print')
  async print(@Res() res: Response): Promise<any> {
    // Configura la impresora
    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: 'tcp://192.168.0.100', // ajusta a tu impresora: usb, tcp, etc.
      // Por ejemplo:
      // interface: 'usb',
      // interface: 'printer:My_Printer',
    });

    try {
      // Verificamos conexión (opcional)
      const isConnected = await printer.isPrinterConnected();
      console.log('La impresora está conectada?:', isConnected);
      if (!isConnected) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('La impresora no está disponible');
      }

      // Contenido a imprimir (simulando un cuadrado con asteriscos)
      printer.alignCenter();
      printer.println('***************');
      printer.println('*             *');
      printer.println('*  CUADRADO   *');
      printer.println('*             *');
      printer.println('***************');
      await printer.cut();

      // Ejecutamos la impresión
      await printer.execute();
      console.log('Impresión enviada con éxito');

      return res
        .status(HttpStatus.OK)
        .send('Impresión completada correctamente');
    } catch (error) {
      console.error('Error al imprimir:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`Error al imprimir: ${error.message}`);
    }
  }
  
}
