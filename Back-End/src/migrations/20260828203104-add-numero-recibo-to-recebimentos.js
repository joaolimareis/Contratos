"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("recebimentos", "numero_recibo", {
    type: Sequelize.STRING(50),
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("recebimentos", "numero_recibo");
}