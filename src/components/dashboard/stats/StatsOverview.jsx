import React from "react";
import { supabase } from "../../../config/supabase";
import StatsCard from "./StatsCard";
import SalesChart from "./SalesChart";
import TopItemsTable from "./TopItemsTable";

function StatsOverview() {
  const [stats, setStats] = React.useState({
    dailySales: 0,
    pendingOrders: 0,
    activeReservations: 0,
    newUsers: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const today = new Date().toISOString().split("T")[0];

        // Fetch daily sales
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("total_price")
          .gte("created_at", today);
          console.log(orders);
        if (ordersError) throw ordersError;

        const dailySales =
          orders?.reduce((sum, order) => sum + (order.total_price || 0), 0) ||
          0;

        // Fetch pending orders
        const { data: pendingOrders, error: pendingOrdersError } = await supabase
          .from("orders")
          .select("id")
          .eq("status", "pending");
          console.log(pendingOrders);
        if (pendingOrdersError) throw pendingOrdersError;

        // Fetch active reservations
        const { data: activeReservations, error: activeReservationsError } = await supabase
          .from("reservations")
          .select("id")
          .eq("status", "confirmed")
          .gte("reservation_datetime", today);

        if (activeReservationsError) throw activeReservationsError;

        // Fetch new users from last 24 hours
        const { data: newUsers, error: newUsersError } = await supabase
          .from("user_profiles")
          .select("id")
          .gte("created_at", new Date(Date.now() - 86400000).toISOString());

        if (newUsersError) throw newUsersError;

        setStats({
          dailySales,
          pendingOrders: pendingOrders?.length || 0,
          activeReservations: activeReservations?.length || 0,
          newUsers: newUsers?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscription for orders
    const ordersSubscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        fetchStats
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel Principal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Ventas Diarias"
          value={`$${stats.dailySales.toFixed(2)}`}
          icon="💰"
          trend={12}
        />
        <StatsCard
          title="Órdenes Pendientes"
          value={stats.pendingOrders}
          icon="📝"
          trend={-5}
        />
        <StatsCard
          title="Reservaciones Activas"
          value={stats.activeReservations}
          icon="📅"
          trend={8}
        />
        <StatsCard
          title="Nuevos Usuarios"
          value={stats.newUsers}
          icon="👥"
          trend={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Ventas de la Semana</h3>
          <SalesChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Platillos Más Vendidos</h3>
          <TopItemsTable />
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
